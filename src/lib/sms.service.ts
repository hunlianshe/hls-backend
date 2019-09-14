import { Injectable } from '@nestjs/common'
const Core = require('@alicloud/pop-core')
import * as config from 'config'
let client

@Injectable()
export class SmsService {
  static init() {
    client = new Core({
      accessKeyId: config.ALIDY.AccessKey,
      accessKeySecret: config.ALIDY.AccessKey,
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
    console.log(params)

    var requestOption = {
      method: 'POST',
    }
    return await client.request('SendSms', params, requestOption)
  }
}
