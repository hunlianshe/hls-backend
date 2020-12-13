import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  Put,
  Query,
  Delete,
} from '@nestjs/common'
import { ProductService } from './product.service'
import { IProduct } from '../../models/product'
import { AjvService } from '../../lib/ajv.service'

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('/listlike')
  async listlike(
    @Req() req: any,
    @Body() body: any,
    @Query() query,
  ): Promise<any> {
    const user = req.user
    return await this.productService.listlike(user._id, query)
  }

  /**
  @apiGroup Product
  @apiVersion 0.1.0
  @api {post} /product/create 创建产品

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

{
    "data": {
      // 有水印的图片地址
        "logoImageUrls": [
            "https://www.baidu.com/1",
            "https://www.baidu.com/2"
        ],
        // 无水印的图片地址
        "noLogoImageUrls": [
            "https://www.baidu.com/1",
            "https://www.baidu.com/2"
        ],
        // 是否被删除, true-被删除 false-未删除
        "deleted": false,
        // 商品id
        "_id": "5fd58a3ecf5e01d21d7babc5",
        // 商品名称
        "name": "test1",
        // 货号
        "articleNum": "货号",
        // 加密货号 - 阿里云使用
        "encryptArticleNum": "加密货号",
        // 产品类别
        "productCategory": "墙纸",
        // 原产地
        "originPlace": "原产地",
        // 创建者
        "userId": "5fb9d3b62959a495d602c00e",
        // 创建时间
        "updatedAt": "2020-12-13T03:27:58.740Z",
        // 更新时间
        "createdAt": "2020-12-13T03:27:58.740Z"
    },
    "code": 200,
    "message": "success"
}
  @apiErrorExample Error-Response:
      HTTP/1.1 200 
  {
  code:500,
  msg:""
  }  
 */
  @Post('/create')
  async createProduct(@Req() req: any, @Body() body): Promise<IProduct> {
    const user = req.user
    body.userId = user._id
    console.log('type of user id', typeof user._id)
    const validator = {
      type: 'object',
      properties: {
        userId: { type: 'object' },
        name: { type: 'string' },
        logoImageUrls: { type: 'array' },
        noLogoImageUrls: { type: 'array' },
        encryptArticleNum: { type: 'string' },
        articleNum: { type: 'string' },
        productCategory: { type: 'string' },
        originPlace: { type: 'string' },
      },
      required: [
        'userId',
        'name',
        'logoImageUrls',
        'noLogoImageUrls',
        'encryptArticleNum',
        'articleNum',
        'productCategory',
        'originPlace',
      ],
    }
    AjvService.verify(body, validator)
    return await this.productService.create(body)
  }

  /**
  @apiGroup Product
  @apiVersion 0.1.0
  @api {put} /product/update/:productId 更新产品

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

{
    "data": "5fd58a3ecf5e01d21d7babc5",
    "code": 200,
    "message": "success"
}
  @apiErrorExample Error-Response:
      HTTP/1.1 200 
  {
  code:500,
  msg:""
  }  
 */
  @Put('/update/:productId')
  async updateProduct(
    @Req() req: any,
    @Body() body,
    @Param() params,
  ): Promise<IProduct> {
    const user = req.user
    // body.userId = user._id;
    await this.productService.update(params.productId, body)
    return params.productId
  }

  /**
  @apiGroup Product
  @apiVersion 0.1.0
  @api {Get} /product/list?objectId=5fd58a3ecf5e01d21d7babc5 获取产品列表(默认每页10条)

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

{
    "data": [
        {
            "logoImageUrls": [
                "https://www.baidu.com/1",
                "https://www.baidu.com/2"
            ],
            "noLogoImageUrls": [
                "https://www.baidu.com/1",
                "https://www.baidu.com/2"
            ],
            "deleted": true,
            "_id": "5fd58a3ecf5e01d21d7babc5",
            "name": "test1",
            "articleNum": "货号",
            "encryptArticleNum": "加密货号",
            "productCategory": "墙纸",
            "originPlace": "原产地",
            "userId": "5fb9d3b62959a495d602c00e",
            "updatedAt": "2020-12-13T03:47:27.244Z",
            "createdAt": "2020-12-13T03:27:58.740Z"
        }
    ],
    "code": 200,
    "message": "success"
}
  @apiErrorExample Error-Response:
      HTTP/1.1 200 
  {
  code:500,
  msg:""
  }  
 */
  @Get('/list')
  async list(@Req() req: any, @Query() query): Promise<IProduct[]> {
    const user = req.user
    return await this.productService.list(query)
  }

  /**
  @apiGroup Product
  @apiVersion 0.1.0
  @api {delete} /product/update/:productId 删除产品

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

{
    "data": "5fd58a3ecf5e01d21d7babc5",
    "code": 200,
    "message": "success"
}
  @apiErrorExample Error-Response:
      HTTP/1.1 200 
  {
  code:500,
  msg:""
  }  
 */
  @Delete('/delete/:productId')
  async deleteProduct(
    @Req() req: any,
    @Body() body,
    @Param() params,
  ): Promise<IProduct> {
    const user = req.user
    // body.userId = user._id;
    await this.productService.delete(params.productId)
    return params.productId
  }
}
