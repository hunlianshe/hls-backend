import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LibModule } from './lib/lib.module'
import { UsersModule } from './app/users/users.module'
import { AuthMiddleware } from './middleware/auth.middleware'
import { UserLikesModule } from './app/userLikes/userLikes.module'
import { ProductModule } from './app/product/product.module'
import { CollectionModule } from './app/collection/collection.module'
import { NestFactory } from '@nestjs/core'
import { ImagesModule } from './app/images/images.module'

@Module({
  imports: [LibModule, UsersModule, ImagesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('users')
    consumer.apply(AuthMiddleware).forRoutes('product')
    consumer.apply(AuthMiddleware).forRoutes('userLikes')
    consumer.apply(AuthMiddleware).forRoutes('collection')
    consumer.apply(AuthMiddleware).forRoutes('orderPay')
  }
}
