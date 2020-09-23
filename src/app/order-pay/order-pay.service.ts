import { Injectable, HttpException } from '@nestjs/common'
import { VipInfo, IVipInfo } from '../../models/vipInfo'
import { IOrder, Order } from '../../models/order'
import { generateOrderNum } from '../../lib/tools'
import WxPay from '../../lib/wxpay'
import * as moment from 'moment'
import { create, all } from 'mathjs'

enum Period {
  YEAR = 'year',
  MONTH = 'month',
  SEASON = 'season',
}

enum ProductType {
  COIN = 'coin',
  BRONZE = 'bronze',
  PLATINUM = 'platinum',
}

interface ICreateOrderParam {
  totalPrice: number
  userId: string
  productType: ProductType
  rightsPeriod?: Period
}

@Injectable()
export class OrderPayService {
  private wxService: WxPay = new WxPay()
  private mathInstance: any = create(all, {
    number: 'BigNumber',
    precision: 64,
  })
  async listVipInfo(): Promise<IVipInfo[]> {
    return await VipInfo.find({})
  }

  async renewVip(user: any, params: any): Promise<any> {}

  caculatePrice(expireAt: Date, yearPrice: number): number {
    const days = moment().diff(expireAt, 'day')
    return this.mathInstance.evaluate(`${yearPrice} / 365 * ${days}`)
  }
  async upgradeVip(user: any, params: any): Promise<any> {
    const vipInfo = await VipInfo.findOne({
      name: user.vipType,
    })
    if (!vipInfo || vipInfo.vipExpireAt < new Date()) throw '会员未开通'
    if (vipInfo.vipType === ProductType.PLATINUM) {
      throw '会员级别已达到最高'
    }
    const upgradeVip = await VipInfo.findOne({
      name: ProductType.PLATINUM,
    })
    let totalPrice = this.caculatePrice(user.vipExpireAt, upgradeVip.yearPrice)
  }

  /*
  
  */
  async renewOrUpgrade(user: any, params: any): Promise<any> {}

  async payVip(user: any, params: any): Promise<any> {
    try {
      // query vip Info
      const vipInfo = await VipInfo.findOne({
        name: params.vipType,
      })
      if (vipInfo) throw '开通会员参数有误'
      let totalPrice
      switch (params.period) {
        case Period.MONTH:
          totalPrice = vipInfo.monthPrice
          break
        case Period.SEASON:
          totalPrice = vipInfo.seasonPrice
        case Period.YEAR:
          totalPrice = vipInfo.seasonPrice
        default:
          throw '开通会员参数有误'
      }
      const orderInfo = await this.createOrder({
        userId: user.id,
        totalPrice,
        productType: params.vipType,
        rightsPeriod: params.period,
      })
      return await this.wxService.payOrder(user, orderInfo)
    } catch (error) {
      throw new HttpException(error, 400)
    }
  }

  async createOrder(params: ICreateOrderParam): Promise<any> {
    const order: IOrder = {
      orderNum: generateOrderNum(),
      isPayed: false,
      ...params,
    }
    await Order.create(order)
    return order
  }

  async recharge(user: any, params: any): Promise<any> {
    // create order
    const orderInfo = await this.createOrder({
      userId: user.id,
      productType: ProductType.COIN,
      ...params,
    })
    try {
      return await this.wxService.payOrder(user, orderInfo)
    } catch (error) {
      throw new HttpException(error, 400)
    }
  }

  async wxPayBack(body: any) {
    try {
      let orderInfo: any = await Order.findOne({
        where: {
          orderNum: body.out_trade_no,
        },
      })
      if (
        orderInfo &&
        body.result_code === 'SUCCESS' &&
        body.return_code === 'SUCCESS'
      ) {
        await Order.update(
          {
            status: 2,
          },
          {
            where: {
              orderNum: body.out_trade_no,
            },
          },
        )
      }
    } catch (error) {
      console.error(`=======payback error:`, error)
    }
  }
}
