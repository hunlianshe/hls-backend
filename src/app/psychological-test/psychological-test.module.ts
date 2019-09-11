import { Module } from '@nestjs/common'
import { LibModule } from '../../lib/lib.module'
import { PsychologicalTestController } from './psychological-test.controller'
import { PsychologicalTestService } from './psychological-test.service'

@Module({
  imports: [LibModule],
  providers: [PsychologicalTestService],
  controllers: [PsychologicalTestController],
})
export class PsychologicalTestModule {}
