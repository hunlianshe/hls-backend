import { Controller, Get, Post, Param, Body, Req } from '@nestjs/common'
import { OrderPayService } from './order-pay.service'
import { IOrder } from 'src/models/order'
import { AjvService } from '../../lib/ajv.service'

@Controller('orderPay')
export class OrderPayController {
  constructor(private readonly orderPayService: OrderPayService) {}

  @Get('vipInfo')
  async getVipInfo(): Promise<any> {
    return await this.orderPayService.listVipInfo()
  }

  /*
  续费 或者 升级

  
  */

  @Post('renewOrUpgrade')
  async renewOrUpgrade(@Req() req: any, @Body() body): Promise<any> {
    const validator = {
      type: 'object',
      properties: {
        period: { type: 'String', enum: ['month', 'season', 'year'] },
        vipType: { type: 'String', enum: ['bronze', 'platinum'] },
        payMethod: { type: 'String', enum: ['coin', 'wechat'] },
      },
    }
    AjvService.verify(body, validator)
    const user = req.user
    return await this.orderPayService.payVip(user, body)
  }

  /*
    开通  Vip
  */
  @Post('payVip')
  async payVip(@Req() req: any, @Body() body): Promise<any> {
    const validator = {
      type: 'object',
      properties: {
        period: { type: 'String', enum: ['month', 'season', 'year'] },
        vipType: { type: 'String', enum: ['bronze', 'platinum'] },
        payMethod: { type: 'String', enum: ['coin', 'wechat'] },
      },
    }
    AjvService.verify(body, validator)
    const user = req.user
    return await this.orderPayService.payVip(user, body)
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
