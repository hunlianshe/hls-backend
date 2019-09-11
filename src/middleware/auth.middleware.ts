import { Injectable, NestMiddleware } from '@nestjs/common'

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: Function) {
    await next()
  }
}
