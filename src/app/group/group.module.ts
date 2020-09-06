import { Module } from '@nestjs/common'
import { GroupService } from './group.service'
import { GroupController } from './group.controller'

@Module({
  imports: [],
  providers: [GroupService],
  controllers: [GroupController],
})
export class GroupModule {}
