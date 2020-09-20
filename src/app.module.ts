import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LibModule } from './lib/lib.module'
import { UsersModule } from './app/users/users.module'
import { AuthMiddleware } from './middleware/auth.middleware'
import { FortuneModule } from './app/fortune/fortune.module'
import { PsychologicalTestModule } from './app/psychological-test/psychological-test.module'
import { ConstellationStoryModule } from './app/constellation-story/constellation-story.module'
import { NestFactory } from '@nestjs/core'
import { GroupService } from './app/group/group.service'
import { GroupController } from './app/group/group.controller'
import { GroupModule } from './app/group/group.module'
import { OrderPayModule } from './app/order-pay/order-pay.module'

@Module({
  imports: [
    LibModule,
    UsersModule,
    FortuneModule,
    PsychologicalTestModule,
    ConstellationStoryModule,
    GroupModule,
    OrderPayModule,
  ],
  controllers: [AppController, GroupController],
  providers: [AppService, GroupService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('users')
    consumer.apply(AuthMiddleware).forRoutes('fortune')
    consumer.apply(AuthMiddleware).forRoutes('group')
    consumer.apply(AuthMiddleware).forRoutes('psychological-test')
    consumer.apply(AuthMiddleware).forRoutes('orderPay')
  }
}
