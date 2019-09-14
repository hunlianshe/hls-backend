import { Injectable, HttpException } from '@nestjs/common'
const Core = require('@alicloud/pop-core')
import * as config from 'config'
let client

@Injectable()
export class SmsService {
  static init() {
    // client = new Core({accessKeyId:  config.ALIDY.AccessKey, secretAccessKey: config.ALIDY.AccessKey})
    console.log(config.ALIDY)
    client = new Core({
      accessKeyId: config.ALIDY.AccessKey,
      accessKeySecret: config.ALIDY.AccessSecret,
      endpoint: config.ALIDY.endpoint,
      apiVersion: '2017-05-25',
    })
  }

  static async sendSms(phone: string, code: string) {
    if (!client) SmsService.init()
    let params = {
      RegionId: 'cn-hangzhou',
      PhoneNumbers: phone,
      SignName: '婚恋社',
      TemplateCode: 'SMS_173765371',
      TemplateParam: '{"code":"' + code + '"}',
    }
    var requestOption = {
      method: 'POST',
    }
    try {
      return await client.request('SendSms', params, requestOption)
    } catch (error) {
      console.log('error', error)
      throw new HttpException('发送频率过快，请稍后尝试', 400)
    }
  }
}
