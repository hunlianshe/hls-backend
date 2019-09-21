import { Injectable } from '@nestjs/common'
import {
  PsychologicalTest,
  IPsychologicalTest,
} from '../../models/psychologicalTest'
import { filterCatOrDog, analyzeReport } from '../../filters/filterAnswer'
import * as _ from 'lodash'
import { IPastLove } from 'src/types'

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
    console.log(res)
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
      if (
        countName[firstIndex] === '美短' ||
        countName[firstIndex] === '波斯'
      ) {
        if (
          countName[secondIndex] === '美短' ||
          countName[secondIndex] === '波斯'
        ) {
          return finalResult
        }
      }
      if (
        countName[firstIndex] === '牧羊' ||
        countName[firstIndex] === '拉布拉多'
      ) {
        if (
          countName[secondIndex] === '牧羊' ||
          countName[secondIndex] === '拉布拉多'
        ) {
          return finalResult
        }
      }
      finalResult.push(analyzeReport[countName[secondIndex]])
    }
    return finalResult
  }

  async getPastLove(gender: number): Promise<IPastLove> {
    let pastLoveRes = await PsychologicalTest.findOne({
      type: '3',
    }).lean()
    if (!pastLoveRes) {
      return {}
    }
    pastLoveRes = pastLoveRes.content.filter(elem => {
      return elem.gender == gender
    })
    console.log(`${JSON.stringify(pastLoveRes)}`)
    const length = pastLoveRes.length - 1
    console.log(pastLoveRes.length)
    return pastLoveRes[_.random(length)]
  }
}
