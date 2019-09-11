import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { LibModule } from '../../lib/lib.module'

@Module({
  imports: [LibModule],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
