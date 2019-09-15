import { Module } from '@nestjs/common'
import { ConstellationStoryService } from './constellation-story.service'
import { ConstellationStoryController } from './constellation-story.controller'
import { LibModule } from '../../lib/lib.module'

@Module({
  imports: [LibModule],
  providers: [ConstellationStoryService],
  controllers: [ConstellationStoryController],
})
export class ConstellationStoryModule {}
