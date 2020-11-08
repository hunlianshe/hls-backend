import { Injectable, HttpException } from '@nestjs/common'
import { VipInfo, IVipInfo } from '../../models/vipInfo'
import { IOrder, Order } from '../../models/order'
import { generateOrderNum, dealWithPrice } from '../../lib/tools'
import WxPay from '../../lib/wxpay'
import * as moment from 'moment'
import { create, all } from 'mathjs'
import { User } from '../../models/user'

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

enum PayMethod {
  COIN = 'coin',
  WECHAT = 'wechat',
}

enum PayType {
  RENEW = 'renew',
  UPGRADE = 'upgrade',
  JOIN = 'join',
}

interface ICreateOrderParam {
  totalPrice: number
  userId: string
  productInfo: {
    // coin bronze platinum
    productType: String
    // 'month' 'season' 'year',
    period?: String
    // 'coin' , 'wechat'
    payMethod: String
    // join , renew , upgrade
    payType?: String
  }
}

@Injectable()
export class OrderPayService {
  private wxService: WxPay = new WxPay()
  private mathInstance: any = create(all, {
    number: 'BigNumber',
    precision: 64,
  })

  async listVipInfo(user: any): Promise<any> {
    const vipList = await VipInfo.find({})
    if (!user.vipType) {
      return {
        user,
        vipList,
      }
    }
    if (user.vipType === ProductType.BRONZE) {
      const vipInfo = vipList.filter(vi => vi.name === ProductType.PLATINUM)[0]
      const days = moment(user.vipExpireAt).diff(moment(), 'day')
      let strNumber: any = `${this.mathInstance.evaluate(
        `${vipInfo.yearPrice} / 365`,
      )}`
      const pricePerDay = dealWithPrice(
        `${this.mathInstance.evaluate(`${vipInfo.yearPrice} / 365`)}`,
      )
      const totalPrice = dealWithPrice(
        `${this.mathInstance.evaluate(`${vipInfo.yearPrice} / 365 * ${days}`)}`,
      )
      return {
        user,
        vipList,
        upgradeInfo: {
          left: days,
          pricePerDay: pricePerDay,
          totalPrice: totalPrice,
        },
      }
    }
  }

  async checkOrderStatus(user: any, params: any): Promise<any> {
    const orderInfo = await Order.findOne({
      orderNum: params.orderNum,
    })
    if (!orderInfo) {
      throw new HttpException('订单不存在', 400)
    }
    const wxRes = await this.wxService.checkOrderStatus(user, orderInfo)
    if (wxRes === 'FAIL') throw new HttpException('支付失败', 400)
    if (!orderInfo.isPayed) {
      // update order
      await Order.update(
        {
          orderNum: orderInfo.orderNum,
        },
        {
          $set: {
            isPayed: true,
          },
        },
      )
      // update user infp
      const userInfo = this.prepareUserVipInfoAfterPay(user, orderInfo)
      await User.updateOne(
        { openid: user.openid },
        {
          $set: {
            ...userInfo,
          },
        },
      )
    }
  }

  async buyVipByWechat(user: any, params: any): Promise<any> {
    let orderInfo: any = {
      userId: user.id,
      productInfo: {},
    }
    await this.dealWithProductInfo(user, params, orderInfo)
    orderInfo.productInfo.payMethod = PayMethod.WECHAT
    orderInfo = await this.createOrder(orderInfo)
    return await this.wxService.payOrder(user, orderInfo)
  }

  async buyVipByCoin(user: any, params: any): Promise<any> {
    let orderInfo: any = {
      userId: user.id,
      productInfo: {},
    }
    await this.dealWithProductInfo(user, params, orderInfo)
    orderInfo.productInfo.payMethod = PayMethod.COIN
    orderInfo = await this.createOrder(orderInfo)
    await this.payWithCoin(user, orderInfo)
  }

  async dealWithProductInfo(
    user: any,
    params: any,
    orderInfo: any,
  ): Promise<any> {
    if (params.payType === PayType.JOIN) {
      // 开通
      await this.caculateJoinTotalPrice(user, params, orderInfo)
    } else if (params.payType === PayType.RENEW) {
      // 续费
      await this.caculateRenewTotalPrice(user, params, orderInfo)
    } else if (params.payType === PayType.UPGRADE) {
      // 升级
      await this.caculateUpgradeTotalPrice(user, params, orderInfo)
    }
  }

  async caculateUpgradeTotalPrice(
    user: any,
    params: any,
    orderInfo: any,
  ): Promise<any> {
    if (!user.vipType) {
      throw new HttpException('当前用户未开通vip', 400)
    }
    if (user.vipType === ProductType.PLATINUM) {
      throw new HttpException('会员等级已达上限', 400)
    }
    const vipInfo = await VipInfo.findOne({
      name: ProductType.PLATINUM,
    })
    const days = moment(user.vipExpireAt).diff(moment(), 'day')
    orderInfo.totalPrice = dealWithPrice(
      `${this.mathInstance.evaluate(`${vipInfo.yearPrice} / 365 * ${days}`)}`,
    )

    orderInfo.productInfo.payMethod = params.payMethod
    orderInfo.productInfo.payType = PayType.UPGRADE
    orderInfo.productInfo.productType = ProductType.PLATINUM
  }

  async caculateRenewTotalPrice(
    user: any,
    params: any,
    orderInfo: any,
  ): Promise<any> {
    if (!user.vipType) {
      throw new HttpException('当前用户未开通vip', 400)
    }
    const vipInfo = await VipInfo.findOne({
      name: user.vipType,
    })
    if (!vipInfo) {
      throw new HttpException('vipType 参数有误', 400)
    }
    switch (params.period) {
      case Period.MONTH:
        orderInfo.totalPrice = vipInfo.monthPrice
        break
      case Period.SEASON:
        orderInfo.totalPrice = vipInfo.seasonPrice
        break
      case Period.YEAR:
        orderInfo.totalPrice = vipInfo.yearPrice
        break
      default:
        break
    }
    orderInfo.productInfo.payMethod = params.payMethod
    orderInfo.productInfo.payType = PayType.RENEW
    orderInfo.productInfo.productType = params.vipType
    orderInfo.productInfo.period = params.period
  }

  async caculateJoinTotalPrice(
    user: any,
    params: any,
    orderInfo: any,
  ): Promise<any> {
    const vipInfo = await VipInfo.findOne({
      name: params.vipType,
    })
    if (!vipInfo) {
      throw new HttpException('vipType参数有误', 400)
    }
    switch (params.period) {
      case Period.MONTH:
        orderInfo.totalPrice = vipInfo.monthPrice
        break
      case Period.SEASON:
        orderInfo.totalPrice = vipInfo.seasonPrice
        break
      case Period.YEAR:
        orderInfo.totalPrice = vipInfo.yearPrice
        break
      default:
        break
    }
    orderInfo.productInfo.payMethod = params.payMethod
    orderInfo.productInfo.payType = PayType.JOIN
    orderInfo.productInfo.productType = params.vipType
    orderInfo.productInfo.period = params.period
  }

  async payWithCoin(user: any, orderInfo: any): Promise<any> {
    if (!user.coin || user.coin < orderInfo.totalPrice) {
      throw new HttpException('余额不足', 400)
    }

    const userInfo = this.prepareUserVipInfoAfterPay(user, orderInfo)
    console.log(userInfo.vipExpireAt)

    await Order.update(
      {
        orderNum: orderInfo.orderNum,
      },
      {
        $set: {
          isPayed: true,
        },
      },
    )

    await User.updateOne(
      { openid: user.openid },
      {
        $set: {
          ...userInfo,
          coin: this.mathInstance.evaluate(
            `${user.coin} - ${orderInfo.totalPrice}`,
          ),
        },
      },
    )
  }

  prepareUserVipInfoAfterPay(user: any, orderInfo: any): any {
    /*
        "productInfo" : {
        "payMethod" : "coin",
        "payType" : "renew",
        "productType" : "platinum",
        "period" : "month"
    },
    */
    const { payType, productType, period } = orderInfo.productInfo
    const userInfo: any = {}
    if (productType === ProductType.COIN) {
      userInfo.coin = `${this.mathInstance.evaluate(
        `${user.coin || 0} + ${orderInfo.totalPrice}`,
      )}`
    }
    switch (payType) {
      case PayType.JOIN:
        userInfo.vipExpireAt = this.caculateExpireAt(period)
        userInfo.vipType = productType
        break
      case PayType.RENEW:
        userInfo.vipExpireAt = this.caculateExpireAt(period, user.vipExpireAt)
        userInfo.vipType = productType
        break
      case PayType.UPGRADE:
        userInfo.vipExpireAt = user.vipExpireAt
        userInfo.vipType = productType
        break
      default:
        break
    }

    return userInfo
  }

  caculateExpireAt(period: Period, time?: Date) {
    switch (period) {
      case 'season':
        return time ? moment(time).add(1, 'Q') : moment().add(1, 'Q')
      case 'month':
        return time ? moment(time).add(1, 'M') : moment().add(1, 'M')
      case 'year':
        return time ? moment(time).add(1, 'y') : moment().add(1, 'y')
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
      productInfo: {
        productType: ProductType.COIN,
        payMethod: PayMethod.WECHAT,
      },
      totalPrice: params.money,
    })
    return await this.wxService.payOrder(user, orderInfo)
  }

  // wxPayBack Need to add logic
  async wxPayBack(body: any) {
    let orderInfo: any = await Order.findOne({
      where: {
        orderNum: body.out_trade_no,
      },
    })
    let userInfo: any = await User.findOne({
      where: {
        _id: orderInfo.userId,
      },
    })
    if (
      orderInfo &&
      orderInfo.isPayed === false &&
      body.result_code === 'SUCCESS' &&
      body.return_code === 'SUCCESS'
    ) {
      userInfo = this.prepareUserVipInfoAfterPay(
        userInfo,
        orderInfo.productInfo,
      )

      await Order.update(
        {
          isPayed: true,
        },
        {
          where: {
            orderNum: body.out_trade_no,
          },
        },
      )
      if (orderInfo.payMethod === PayMethod.COIN) {
        await User.updateOne(
          { openid: userInfo.openid },
          {
            $set: {
              ...userInfo,
              coin: this.mathInstance.evaluate(
                `${userInfo.coin} - ${orderInfo.totalPrice}`,
              ),
            },
          },
        )
      } else {
        await User.updateOne(
          { openid: userInfo.openid },
          {
            $set: {
              ...userInfo,
            },
          },
        )
      }
    }
  }
}
