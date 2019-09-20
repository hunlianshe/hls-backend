import { Injectable } from '@nestjs/common'
import {
  PsychologicalTest,
  IPsychologicalTest,
} from '../../models/psychologicalTest'
import { filterCatOrDog, analyzeReport } from '../../filters/filterAnswer'
import * as _ from 'lodash'

@Injectable()
export class PsychologicalTestService {
  async findPsyTest(): Promise<IPsychologicalTest[]> {
    return await PsychologicalTest.find({})
  }
  async findPsyTestById(_id: string): Promise<IPsychologicalTest> {
    return await PsychologicalTest.findOne({ _id })
  }

  /**
   
   body {
     answer: [A, B,C,D,A,B]
   } 
  */
  async generateCatOrDogResult(
    body: any,
  ): Promise<{ title: string; feature: string }[]> {
    const res: any = filterCatOrDog(body)
    // go on to deal with res ['美短', '拉布拉多', '牧羊', '波斯', '美短'. '牧羊']
    const countName: string[] = ['美短', '波斯', '牧羊', '拉布拉多']
    const countRes: number[] = [0, 0, 0, 0]
    res.forEach(res => {
      switch (res) {
        case '美短':
          countRes[0] += 1
          break
        case '波斯':
          countRes[1] += 1
          break
        case '牧羊':
          countRes[2] += 1
          break
        case '拉布拉多':
          countRes[3] += 1
          break
        default:
          break
      }
    })
    const maxValue = _.max(countRes)
    const firstIndex = _.indexOf(countRes, maxValue)
    let finalResult: { title: string; feature: string }[] = []
    if (firstIndex > -1) {
      finalResult.push(analyzeReport[countName[firstIndex]])
    }
    const secondIndex = _.indexOf(countRes, maxValue, firstIndex + 1)
    if (secondIndex > -1) {
      finalResult.push(analyzeReport[countName[secondIndex]])
    }
    return finalResult
  }
}
