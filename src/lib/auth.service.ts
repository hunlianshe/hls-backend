import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthService {
  static async isAuthenticated() {}
  static async fromHeaderOrQuerystring(ctx: any) {
    const req = ctx.request
    return (
      req.headers.authorization ||
      req.query.authorization ||
      req.headers.authorization
    )
  }
}
