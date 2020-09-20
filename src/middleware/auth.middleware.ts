import { Injectable, NestMiddleware, HttpException } from '@nestjs/common'
import { SecureService } from '../lib/secure.service'
import { User, IUser } from '../models/user'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: any, res: Response, next: Function) {
    if (
      req.url.includes('openidfromwx') ||
      req.url.includes('register') ||
      req.url.includes('adminlogin') ||
      req.url.includes('plist') ||
      req.url.includes('adminuserlist')
    )
      return next()
    console.log('psychological-test', req.url)
    let token = req.headers.authorization
    if (!token || !token.includes('Bearer'))
      throw new HttpException('Authentication failed', 401)
    token = token.replace('Bearer ', '')
    let tokenMessage
    try {
      tokenMessage = SecureService.jwtDecrypt(token)
    } catch (err) {
      console.error('err', err)
      throw new HttpException('Authentication failed', 401)
    }
    let user = await User.findOne({ openid: tokenMessage.openid })
    console.log('user', user)
    req.user = user
    await next()
  }
}
