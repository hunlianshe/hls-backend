import * as xmlreader from 'xmlreader'
const crypto = require('crypto')
import * as config from 'config'
import axios from 'axios'
import { Method } from 'axios'
import * as bluebird from 'bluebird'
const xmlreader = require('xmlreader')
const xmlreaderAsync = bluebird.promisifyAll(xmlreader)

interface IWXConfig {
  appId: string
  appSecret: string
  mchid: string
  mchkey: string
  wxurl: string
}

export interface IWxPayOrderInfo {
  openid: string
  outTradeNo: string
  spbillCreateIp: string
  totalFee: string
  sign: string
  nonceStr: string
  body: string
}

export interface ISearchWxOrderInfo {
  nonce_str: string
  transaction_id?: string
  sign: string
  out_trade_no: string
}

export default class WxPay {
  private organizationConfig: IWXConfig
  constructor() {
    this.organizationConfig = {
      appId: config.MINI.appId,
      appSecret: config.MINI.appSecret,
      mchid: config.MINI.mchid,
      mchkey: config.MINI.mchkey,
      wxurl: config.MINI.wxurl,
    }
  }

  public async payOrder(userInfo: any, orderDetails: any) {
    console.log(`------当前订单信息------`, JSON.stringify(orderDetails))
    const nonceStr = WxPay.createNonceStr()
    const timeStamp = WxPay.createTimeStamp()
    const money = WxPay.getmoney(orderDetails.totalPrice)
    const sign = this.paysignjsapi(
      orderDetails.orderNum,
      nonceStr,
      userInfo.openid,
      orderDetails.orderNum,
      userInfo.spbillCreateIp,
      money,
    )

    console.log('----sign----', sign)
    const formData = this.generatePayXmlFormData({
      body: orderDetails.orderNum || '',
      sign,
      nonceStr,
      openid: userInfo.openid || '',
      outTradeNo: orderDetails.orderNum || '',
      spbillCreateIp: userInfo.spbillCreateIp,
      totalFee: `${money}`,
    })

    console.log(`------formData------`, formData)

    const wxResponse = await axios.post(config.MINI.pay, formData)
    if (wxResponse.status == 200) {
      const body = wxResponse.data
      const response = await xmlreaderAsync.readAsync(body.toString('utf-8'))
      if (!response.xml.prepay_id) {
        throw new Error(response.xml.return_msg.text())
      }
      console.log('长度===', response.xml.prepay_id.text().length)
      var prepay_id = response.xml.prepay_id.text()
      console.log('解析后的prepay_id==', prepay_id)

      //将预支付订单和其他信息一起签名后返回给前端
      let wxpackage = 'prepay_id=' + prepay_id
      let minisign = this.paysignjsapimini(nonceStr, wxpackage, timeStamp)
      return {
        appId: config.MINI.appId,
        partnerId: config.MINI.mchid,
        prepayId: prepay_id,
        nonceStr,
        timeStamp,
        package: 'Sign=WXPay',
        paySign: minisign,
      }
    } else {
      throw '支付失败'
    }
  }

  async checkOrderStatus(
    user: any,
    params: { orderId: number; userId: number },
    orderInfo,
  ) {
    // const outTradeNo = 'hg020200105787142';
    const nonceStr = WxPay.createNonceStr()
    // const searchOptions = {
    //   nonce_str: nonceStr,
    //   out_trade_no: outTradeNo,
    // };
    const searchOptions = {
      nonce_str: nonceStr,
      out_trade_no: orderInfo.orderNum,
    }
    const searchOrderSign = this.wxRequestParamsSign(searchOptions)
    const requestFormData = this.generateSearchOrderInfoFormData({
      sign: searchOrderSign,
      ...searchOptions,
    })
    try {
      const parseResult = await this.wechatXmlRequestApi(
        config.MINI.order,
        requestFormData,
      )
      console.log(`search order response=========`, parseResult)
      const wxOrderCode = parseResult.return_code
      if (wxOrderCode !== 'SUCCESS' || parseResult.trade_state !== 'SUCCESS') {
        return 'FAIL'
      }

      // if (orderInfo.status === 1) {
      //   // pay success
      //   await models.Order.update(
      //     {
      //       status: 2,
      //     },
      //     {
      //       where: {
      //         id: params.orderId,
      //         user_id: params.userId,
      //       },
      //     },
      //   );
      // }
      return wxOrderCode
    } catch (error) {
      console.log(`search order error========`, error)
    }
  }

  static async wxPayBack(body: any) {
    try {
      let orderInfo: any = await models.Order.findOne({
        where: {
          orderNum: body.out_trade_no,
        },
      })
      if (
        orderInfo &&
        body.result_code === 'SUCCESS' &&
        body.return_code === 'SUCCESS'
      ) {
        await models.Order.update(
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

  async wechatXmlRequestApi(
    url: string,
    formData: string,
    method: Method = 'POST',
  ) {
    const response = await axios({
      method,
      url,
      data: formData,
    })
    const parseResult = await xmlreaderAsync.readAsync(
      response.data.toString('utf-8'),
    )
    const xml = parseResult.xml
    let result: any = {}
    for (let key in xml) {
      const value = xml[key]
      if (value.hasOwnProperty('text')) {
        result[key] = xml[key].text()
      }
    }
    return result
  }

  public static getmoney(money) {
    return parseFloat(money) * 100
  }

  public static createNonceStr() {
    return Math.random()
      .toString(36)
      .substr(2, 15)
  }

  public static createTimeStamp() {
    const currentDate = new Date().getTime()
    return parseInt(`${currentDate / 1000}`) + ''
  }

  //签名加密算法
  paysignjsapi(
    body: any,
    nonce_str: any,
    openid: any,
    out_trade_no: any,
    spbill_create_ip: any,
    total_fee: any,
  ) {
    var ret = {
      appid: this.organizationConfig.appId,
      mch_id: this.organizationConfig.mchid,
      nonce_str: nonce_str,
      body: body,
      notify_url: this.organizationConfig.wxurl,
      openid: openid,
      out_trade_no: out_trade_no,
      spbill_create_ip: spbill_create_ip,
      total_fee: total_fee,
      trade_type: 'JSAPI',
    }
    console.log('ret==', ret)
    var string = this.raw(ret)
    var key = this.organizationConfig.mchkey
    string = string + '&key=' + key
    console.log('string=', string)
    var crypto = require('crypto')
    return crypto
      .createHash('md5')
      .update(string, 'utf8')
      .digest('hex')
      .toUpperCase()
  }

  // 小程序签名
  paysignjsapimini(nonceStr: any, wxpackage: any, timestamp: any) {
    var ret = {
      appId: this.organizationConfig.appId,
      nonceStr: nonceStr,
      package: wxpackage,
      signType: 'MD5',
      timeStamp: timestamp,
    }
    console.log('Miniret==', ret)
    var string = this.raw(ret)
    var key = this.organizationConfig.mchkey
    string = string + '&key=' + key
    console.log('Ministring>>>>>>', string)
    var crypto = require('crypto')
    return crypto
      .createHash('md5')
      .update(string, 'utf8')
      .digest('hex')
      .toUpperCase()
  }

  wxRequestParamsSign(parameters: any) {
    console.log('wxRequestParamsSign==', parameters)
    var string = this.raw({
      ...parameters,
      mch_id: this.organizationConfig.mchid,
      appid: this.organizationConfig.appId,
    })
    var key = this.organizationConfig.mchkey
    string = string + '&key=' + key
    console.log('Ministring>>>>>>', string)
    var crypto = require('crypto')
    return crypto
      .createHash('md5')
      .update(string, 'utf8')
      .digest('hex')
      .toUpperCase()
  }

  public static getXMLNodeValue(xml) {
    xmlreader.read(xml, function(errors, response) {
      if (null !== errors) {
        console.log(errors)
        return
      }
      console.log('长度===', response.xml.prepay_id.text().length)
      var prepay_id = response.xml.prepay_id.text()
      console.log('解析后的prepay_id==', prepay_id)
      return prepay_id
    })
  }

  //签名加密算法,第二次的签名
  paysignjsapifinal(prepayid, noncestr, timestamp) {
    var ret = {
      appid: this.organizationConfig.appId,
      partnerid: this.organizationConfig.mchid,
      prepayid: prepayid,
      package: 'Sign=WXPay',
      noncestr: noncestr,
      timestamp: timestamp,
    }
    console.log('retretret==', ret)
    var string = this.raw(ret)
    var key = this.organizationConfig.mchkey
    string = string + '&key=' + key
    console.log('stringstringstring=', string)
    var crypto = require('crypto')
    return crypto
      .createHash('md5')
      .update(string, 'utf8')
      .digest('hex')
      .toUpperCase()
  }

  public static json2Xml(jsonContent) {
    let _xml = ''
    Object.keys(jsonContent).map(key => {
      _xml += `<${key}>${jsonContent[key]}</${key}>`
    })
    return `<xml>${_xml}</xml>`
  }

  generatePayXmlFormData(orderInfo: IWxPayOrderInfo) {
    //组装xml数据
    var formData = '<xml>'
    formData += '<appid>' + this.organizationConfig.appId + '</appid>' //appid
    formData += '<body><![CDATA[' + `${orderInfo.body}` + ']]></body>'
    formData += '<mch_id>' + this.organizationConfig.mchid + '</mch_id>' //商户号
    formData += '<nonce_str>' + orderInfo.nonceStr + '</nonce_str>' //随机字符串，不长于32位。
    formData += '<notify_url>' + this.organizationConfig.wxurl + '</notify_url>'
    formData += '<openid>' + orderInfo.openid + '</openid>'
    formData += '<out_trade_no>' + orderInfo.outTradeNo + '</out_trade_no>'
    formData +=
      '<spbill_create_ip>' + orderInfo.spbillCreateIp + '</spbill_create_ip>'
    formData += '<total_fee>' + orderInfo.totalFee + '</total_fee>'
    formData += '<trade_type>' + 'JSAPI' + '</trade_type>'
    formData += '<sign>' + orderInfo.sign + '</sign>'
    formData += '</xml>'
    return formData
  }

  generateSearchOrderInfoFormData(searchInfo: ISearchWxOrderInfo) {
    //组装xml数据
    var formData = '<xml>'
    formData += '<appid>' + this.organizationConfig.appId + '</appid>' //appid
    formData += '<mch_id>' + this.organizationConfig.mchid + '</mch_id>' //商户号
    formData += '<out_trade_no>' + searchInfo.out_trade_no + '</out_trade_no>'
    formData += '<nonce_str>' + searchInfo.nonce_str + '</nonce_str>' //随机字符串，不长于32位。
    formData += '<sign>' + searchInfo.sign + '</sign>'
    formData += '</xml>'
    return formData
  }

  private raw(args) {
    var keys = Object.keys(args)
    keys = keys.sort()
    var newArgs = {}
    keys.forEach(function(key) {
      newArgs[key] = args[key]
    })
    var string = ''
    for (var k in newArgs) {
      string += '&' + k + '=' + newArgs[k]
    }
    string = string.substr(1)
    return string
  }
}
