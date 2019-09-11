import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { LibModule } from './lib/lib.module'
import { UsersModule } from './app/users/users.module'
import { AuthMiddleware } from './middleware/auth.middleware'
import { FortuneModule } from './app/fortune/fortune.module'
import { PsychologicalTestController } from './app/psychological-test/psychological-test.controller'
import { PsychologicalTestModule } from './app/psychological-test/psychological-test.module'

@Module({
  imports: [LibModule, UsersModule, FortuneModule, PsychologicalTestModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('users')
    consumer.apply(AuthMiddleware).forRoutes('fortune')
  }
}
