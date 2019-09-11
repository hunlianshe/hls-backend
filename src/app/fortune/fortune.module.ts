import { Module } from '@nestjs/common'
import { FortuneService } from './fortune.service'
import { FortuneController } from './fortune.controller'
import { LibModule } from '../../lib/lib.module'

@Module({
  imports: [LibModule],
  providers: [FortuneService],
  controllers: [FortuneController],
})
export class FortuneModule {}
