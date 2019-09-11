import { Injectable } from '@nestjs/common'
import {
  PsychologicalTest,
  IPsychologicalTest,
} from '../../models/psychologicalTest'

@Injectable()
export class PsychologicalTestService {
  async findPsyTest(): Promise<IPsychologicalTest[]> {
    return await PsychologicalTest.find({})
  }
  async findPsyTestById(_id: string): Promise<IPsychologicalTest> {
    return await PsychologicalTest.findOne({ _id })
  }
}
