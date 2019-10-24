import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import * as config from 'config'
import * as moment from 'moment'
const request = require('request-promise')
let map = new Map()
interface IApiClient {
  getOpenid(code: string): void
}
interface OpenidObject {
  session_key?: string
  openid?: string
  errcode?: number
  errmsg?: string
  hints?: any
}
export interface WxAccessToken {
  access_token?: string
  expires_in?: number
}

@Injectable()
export class ClientService {
  static async getOpenid(code: string): Promise<OpenidObject> {
    let url =
      config.MINI.host +
      '/sns/jscode2session?appid=' +
      config.MINI.appId +
      '&secret=' +
      config.MINI.appSecret +
      '&js_code=' +
      code
    '&grant_type=authorization_code'
    console.log('url', url)
    let result: OpenidObject = JSON.parse(await request(url))
    if (result.errcode)
      throw new HttpException(
        'request wxerror' + result.errmsg,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    return result
  }
  async getAccessToken(): Promise<WxAccessToken> {
    let url =
      config.MINI.host +
      '/cgi-bin/token?appid=' +
      config.MINI.appId +
      '&secret=' +
      config.MINI.appSecret +
      '&grant_type=client_credential'
    let result: WxAccessToken = JSON.parse(await request(url))
    console.log('getAccessToken', result)
    return result
  }

  static async getHoroscope(params): Promise<any> {
    let url = `${config.HOROSCOPE.HOST}&${params}&key=${config.HOROSCOPE.KEY}`
    if (map.get(url + moment().format('YYYYMMDD')))
      return map.get(url + moment().format('YYYYMMDD'))
    console.log('url111', url)
    let result = JSON.parse(await request(url))
    console.log('result', result)
    map.set(url + moment().format('YYYYMMDD'), result)
    return result
  }

  static async constellationMmatching(params): Promise<any> {
    params = decodeURI(params).replace(/座/gi, '')
    params = decodeURI(params).replace(/\?/gi, '')
    params = encodeURI(params)
    console.log('params', params)
    let url = `${config.TIANAPI.HOST}/txapi/xingzuo?${params}&key=${config.TIANAPI.KEY}`
    console.log('url', url)
    if (map.get(url + moment().format('YYYYMMDD')))
      return map.get(url + moment().format('YYYYMMDD'))
    let result = JSON.parse(await request(url))
    console.log('result', result)
    map.set(url + moment().format('YYYYMMDD'), result.result)
    return result.newslist[0]
  }
}
