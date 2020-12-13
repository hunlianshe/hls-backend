import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Delete,
  Req,
  Put,
} from '@nestjs/common'
import { AjvService } from '../../lib/ajv.service'
import { CollectionService } from './collection.service'
import { ICollection } from 'src/models/collection'

@Controller('collection')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  /**
  @apiGroup collection
  @apiVersion 0.1.0
  @api {get} http://localhost:8009/collection/list 获取收藏夹列表

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 
{
    "data": [
        {
            "_id": "5fd584dc8c6d41bdf3cdc325",
            "name": "默认收藏夹",
            "desc": "默认收藏夹",
            "userId": "5fb9d3b62959a495d602c00e",
            "createdAt": "2020-12-13T03:05:00.791Z",
            "updatedAt": "2020-12-13T03:05:00.791Z"
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
  async listCollection(@Req() req, @Param() params): Promise<ICollection[]> {
    const user = req.user
    return await this.collectionService.listCollection(user._id)
  }

  /**
  @apiGroup collection
  @apiVersion 0.1.0
  @api {post} http://localhost:8009/collection/create 创建收藏夹

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

  {
    "data": {
        "_id": "5fd584dc8c6d41bdf3cdc325",
        "name": "默认收藏夹",
        "desc": "默认收藏夹",
        "userId": "5fb9d3b62959a495d602c00e",
        "createdAt": "2020-12-13T03:05:00.791Z",
        "updatedAt": "2020-12-13T03:05:00.791Z"
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
  async createCollection(@Req() req, @Body() body): Promise<ICollection> {
    const user = req.user
    body.userId = user._id
    const validator = {
      type: 'object',
      properties: {
        name: { type: 'string' },
      },
      required: ['name'],
    }
    AjvService.verify(body, validator)
    return await this.collectionService.createCollection(body)
  }

  /**
  @apiGroup collection
  @apiVersion 0.1.0
  @api {delete} http://localhost:8009/collection/update/5fd584dc8c6d41bdf3cdc325 删除收藏夹

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

 {
    "data": "5fd584dc8c6d41bdf3cdc325",
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
  @Delete('/delete/:collectionId')
  async deleteCollection(
    @Req() req,
    @Param() params,
    @Body() body,
  ): Promise<string> {
    const user = req.user
    await this.collectionService.deleteCollection(user._id, params.collectionId)
    return params.collectionId
  }

  /**
  @apiGroup collection
  @apiVersion 0.1.0
  @api {put} http://localhost:8009/collection/update/5fd584dc8c6d41bdf3cdc325 更新收藏夹

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

 {
    "data": "5fd584dc8c6d41bdf3cdc325",
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
  @Put('/update/:collectionId')
  async updateCollection(
    @Param() params,
    @Req() req,
    @Body() body,
  ): Promise<string> {
    const user = req.user
    await this.collectionService.updateCollection(
      user._id,
      params.collectionId,
      body,
    )
    return params.collectionId
  }
}
