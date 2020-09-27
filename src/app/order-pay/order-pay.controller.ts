import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  Res,
  All,
} from '@nestjs/common'
import { OrderPayService } from './order-pay.service'
import { IOrder } from 'src/models/order'
import { AjvService } from '../../lib/ajv.service'
import WxPay from '../../lib/wxpay'

@Controller('orderPay')
export class OrderPayController {
  constructor(private readonly orderPayService: OrderPayService) {}

  /**
  @apiGroup orderPay
  @apiVersion 0.1.0
  @api {get} /orderPay/checkOrderStatus/:orderNum 检查订单状态

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 
{
    "message": "订单不存在",
    "code": 400,
    "url": "/orderPay/checkOrderStatus/5f7067337130141fe4a4d03b"
}
  @apiErrorExample Error-Response:
      HTTP/1.1 200 
  {
  code:500,
  msg:""
  }  
 */
  @Get('checkOrderStatus/:orderNum')
  async checkOrderStatus(@Req() req, @Param() params: any): Promise<any> {
    const validator = {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['orderNum'],
    }
    const user = req.user
    AjvService.verify(params, validator)
    return await this.orderPayService.checkOrderStatus(user, params)
  }

  /**
  @apiGroup orderPay
  @apiVersion 0.1.0
  @api {get} /orderPay/payback 微信回调接口(仅供微信使用)

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 
  {
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
  @All('payback')
  async payback(@Body() body, @Res() res): Promise<any> {
    var sendData = {
      return_code: 'SUCCESS',
      return_msg: 'OK',
    }
    res.type = 'application/xml; charset=utf-8'
    await this.orderPayService.wxPayBack(body)
    return WxPay.json2Xml(sendData)
  }

  /**
  @apiGroup orderPay
  @apiVersion 0.1.0
  @api {get} /orderPay/vipInfo 会员的详细信息

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 
{
    "data": {
      // 用户信息
        "user": {
            "_id": "5f7055a9c67ef53a39737282",
            "openid": "oHgB55EH5FTL-opz630hkUiLxAC0",
            "avatarUrl": "https://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIKFdibZkOTzica1w9M3t6f4icb0MRmB1187YXdyQ8Y6NnBicRyZ4xVXAMTXNFHEqqr8vJwE2K3bjQ9KQ/132",
            "city": "",
            "country": "China",
            "createdAt": "2020-09-27T09:04:41.038Z",
            "gender": 1,
            "language": "zh_CN",
            "nickName": "A、double",
            "province": "",
            "coin": 970,
            "updatedAt": "2020-09-27T10:39:38.448Z",
            "vipExpireAt": "2020-10-27T10:39:37.248Z",
            "vipType": "bronze"
        },
        // 会员信息列表
        "vipList": [
            {
                "rightsInfo": [
                    "星座运势",
                    "心理测试",
                    "星座配对",
                    "3次",
                    "20人",
                    "3次"
                ],
                "_id": "5f705cd52e57dea2c5dc1ae9",
                "name": "normal",
                "createdAt": "2020-09-27T09:35:17.183Z",
                "updatedAt": "2020-09-27T09:35:17.183Z"
            },
            {
                "rightsInfo": [
                    "星座运势",
                    "心理测试",
                    "星座配对",
                    "无限次",
                    "无限次",
                    "20次",
                    "谁喜欢我",
                    "相互喜欢"
                ],
                "_id": "5f705cf02e57dea2c5dc1aea",
                "name": "bronze",
                "yearPrice": 120,
                "seasonPrice": 30,
                "monthPrice": 10,
                "createdAt": "2020-09-27T09:35:44.943Z",
                "updatedAt": "2020-09-27T09:35:44.943Z"
            },
            {
                "rightsInfo": [
                    "星座运势",
                    "心理测试",
                    "星座配对",
                    "无限次",
                    "无限次",
                    "无限次",
                    "谁喜欢我",
                    "相互喜欢"
                ],
                "_id": "5f705cff2e57dea2c5dc1aeb",
                "name": "platinum",
                "yearPrice": 240,
                "seasonPrice": 60,
                "monthPrice": 20,
                "createdAt": "2020-09-27T09:35:59.006Z",
                "updatedAt": "2020-09-27T09:35:59.006Z"
            }
        ],
        // 升级会员会员的详细信息
        "upgradeInfo": {
            // 还剩下天数
            "left": 29,
            // 每天价格
            "pricePerDay": "0.6575342465753424657534246575342465753424657534246575342465753425",
            // 合计价格
            "totalPrice": "19.06849315068493150684931506849315068493150684931506849315068493"
        }
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
  @Get('vipInfo')
  async getVipInfo(@Req() req: any): Promise<any> {
    const user = req.user
    return await this.orderPayService.listVipInfo(user)
  }

  /**
  @apiGroup orderPay
  @apiVersion 0.1.0
  @api {post} /orderPay/buyVipByWechat 微信支付
  @apiParamExample {json} Request-Example:
  {
    // 选择年付, 月付, 季付
    "period": "month", // "month"-月 "season"-季度 "year"-年
    // 会员类型 
    "vipType": "bronze", // "bronze"-黄铜 "platinum"-白金 
    // 付款类型
    "payType": "join" // "join"-加入 "renew"-续费 "upgrade"-升级
  }

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

{
    "data": {
        "appId": "wx962723a0268b268e",
        "partnerId": "1602796527",
        "prepayId": "wx27175719646254a308371ec1c5d5af0000",
        "nonceStr": "noj090wjruk",
        "timeStamp": "1601200629",
        "package": "Sign=WXPay",
        "paySign": "2E21D89BE263A25D163F3FEBAD887C9F"
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
  @Post('buyVipByWechat')
  async buyVipByWechat(@Req() req: any, @Body() body): Promise<any> {
    const validator = {
      type: 'object',
      properties: {
        period: { enum: ['month', 'season', 'year'] },
        vipType: { enum: ['bronze', 'platinum'] },
        payType: { enum: ['join', 'renew', 'upgrade'] },
      },
    }
    AjvService.verify(body, validator)
    const user = req.user
    user.spbillCreateIp = req.ip.replace(/::ffff:/g, '')
    return await this.orderPayService.buyVipByWechat(user, body)
  }

  /**
  @apiGroup orderPay
  @apiVersion 0.1.0
  @api {post} /orderPay/buyVipByCoin 使用缘分币购买vip
  @apiParamExample {json} Request-Example:
  {
     // 选择年付, 月付, 季付
    "period": "month", // "month"-月 "season"-季度 "year"-年
    // 会员类型 
    "vipType": "bronze", // "bronze"-黄铜 "platinum"-白金 
    // 付款类型
    "payType": "join" // "join"-加入 "renew"-续费 "upgrade"-升级
  }

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

{
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
  @Post('buyVipByCoin')
  async buyVipByCoin(@Req() req: any, @Body() body): Promise<any> {
    const validator = {
      type: 'object',
      properties: {
        period: { enum: ['month', 'season', 'year'] },
        vipType: { enum: ['bronze', 'platinum'] },
        payType: { enum: ['join', 'renew', 'upgrade'] },
      },
    }
    AjvService.verify(body, validator)
    const user = req.user
    return await this.orderPayService.buyVipByCoin(user, body)
  }

  /**
  @apiGroup orderPay
  @apiVersion 0.1.0
  @api {post} /orderPay/recharge 充值
  @apiParamExample {json} Request-Example:
  {
    // 充值金额
    "money": 100
  }

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

{
    "data": {
        "appId": "wx962723a0268b268e",
        "partnerId": "1602796527",
        "prepayId": "wx2718150380906198c501ebd037baa50000",
        "nonceStr": "xvl7wa1wmvm",
        "timeStamp": "1601201703",
        "package": "Sign=WXPay",
        "paySign": "232D0CC4EC4253F4A514F63211BA54E0"
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
  @Post('recharge')
  async recharge(@Req() req: any, @Body() body): Promise<any> {
    const validator = {
      type: 'object',
      properties: {
        money: { type: 'number' },
      },
      required: ['money'],
    }
    const user = req.user
    user.spbillCreateIp = req.ip.replace(/::ffff:/g, '')
    AjvService.verify(body, validator)
    return await this.orderPayService.recharge(user, body)
  }
}
