import { Module } from '@nestjs/common'
import { UserLikesService } from './userLikes.service'
import { UserLikesController } from './userLikes.controller'
import { LibModule } from '../../lib/lib.module'

@Module({
  imports: [LibModule],
  providers: [UserLikesService],
  controllers: [UserLikesController],
})
export class UserLikesModule {}
