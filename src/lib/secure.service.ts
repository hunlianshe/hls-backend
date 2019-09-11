import { Injectable } from '@nestjs/common'
import * as config from 'config'
const jwt = require('jsonwebtoken')

@Injectable()
export class SecureService {
  static generateToken = (id: string, expireTime?: Date) => {
    let condition: any = {}
    condition.id = id
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
}
