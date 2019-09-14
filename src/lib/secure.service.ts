import { Injectable } from '@nestjs/common'
import * as config from 'config'
const jwt = require('jsonwebtoken')

@Injectable()
export class SecureService {
  static generateToken = (openid: string, expireTime?: Date) => {
    let condition: any = {}
    condition.openid = openid
    let token = SecureService.jwtCrypto(condition, expireTime)
    return token
  }
  static jwtCrypto(payload: any, expireTime?: Date): string {
    let crypto
    let jwtSecretKey = config.SECURE.keys.jwtSecretKey
    if (expireTime !== undefined) {
      crypto = jwt.sign(payload, jwtSecretKey, expireTime)
    } else {
      crypto = jwt.sign(payload, jwtSecretKey)
    }
    return crypto
  }
  static jwtDecrypt(text: string): any {
    let jwtSecretKey = config.SECURE.keys.jwtSecretKey
    return jwt.verify(text, jwtSecretKey)
  }
}
