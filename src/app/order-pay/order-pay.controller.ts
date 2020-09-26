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

  @Get('checkOrderStatus/:id')
  async checkOrderStatus(@Req() req, @Param() params: any): Promise<any> {
    const validator = {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['id'],
    }
    const user = req.user
    AjvService.verify(params, validator)
    return await this.orderPayService.checkOrderStatus(user, params)
  }

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

  @Get('vipInfo')
  async getVipInfo(@Req() req: any): Promise<any> {
    const user = req.user
    return await this.orderPayService.listVipInfo(user)
  }

  /*
   微信支付
  */

  @Post('buyVipByWechat')
  async buyVipByWechat(@Req() req: any, @Body() body): Promise<any> {
    const validator = {
      type: 'object',
      properties: {
        period: { type: 'String', enum: ['month', 'season', 'year'] },
        vipType: { type: 'String', enum: ['bronze', 'platinum'] },
        payType: { type: 'String', enum: ['join', 'renew', 'upgrade'] },
      },
    }
    AjvService.verify(body, validator)
    const user = req.user
    return await this.orderPayService.buyVipByWechat(user, body)
  }

  /*
    缘分币支付
  */
  @Post('buyVipByCoin')
  async buyVipByCoin(@Req() req: any, @Body() body): Promise<any> {
    const validator = {
      type: 'object',
      properties: {
        period: { type: 'String', enum: ['month', 'season', 'year'] },
        vipType: { type: 'String', enum: ['bronze', 'platinum'] },
        payType: { type: 'String', enum: ['join', 'renew', 'upgrade'] },
      },
    }
    AjvService.verify(body, validator)
    const user = req.user
    return await this.orderPayService.buyVipByCoin(user, body)
  }

  /*
    充值
    money: Number
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
    AjvService.verify(body, validator)
    return await this.orderPayService.recharge(req.user, body)
  }
}
