import { Injectable } from '@nestjs/common'
import { IFortune, Fortune } from '../../models/fortune'
import { ClientService } from '../../lib/client.service'
import { UserDetail } from '../../models/user_detail'
import { RulesService } from '../../lib/rules.service'

@Injectable()
export class FortuneService {
  async findByName(name: string): Promise<IFortune> {
    return await Fortune.findOne({ name })
  }

  async getHoroscope(params: string): Promise<IFortune> {
    return await ClientService.getHoroscope(params)
  }

  async constellationMmatching(params: string): Promise<IFortune> {
    return await ClientService.constellationMmatching(params)
  }

  async constellationMmatchingComplex(openid: string): Promise<any> {
    let user = await UserDetail.findOne({ openid })
    let model = {}
    let opposite
    if (user.gender === 1) {
      opposite = UserDetail.findOne({
        gender: 2,
        'objectInfo.salary': { $exists: true },
      })
      model = {
        salary: RulesService.generateSalaryScore(user.salary, opposite.salary),
        height: RulesService.generateSalaryScore(user.height, opposite.height),
        age: RulesService.generateSalaryScore(user.age, opposite.age),
        star: await ClientService.constellationMmatching(
          `?me=${user.constellation}&he=${opposite.constellation}`,
        ),
      }
    } else {
      opposite = UserDetail.findOne({
        gender: 1,
        'objectInfo.salary': { $exists: true },
      })
      model = {
        salary: RulesService.generateSalaryScore(opposite.salary, user.salary),
        height: RulesService.generateSalaryScore(opposite.height, user.height),
        age: RulesService.generateSalaryScore(opposite.age, user.age),
        star: await ClientService.constellationMmatching(
          `?me=${opposite.constellation}&he=${user.constellation}`,
        ),
      }
    }
    return model
  }

  async updateDoc(): Promise<void> {
    let fortures = await Fortune.find()
    for (let i = 0; i < fortures.length; i++) {
      fortures[i].desc = fortures[i].desc.replace(/\n/g, '<br></br>')
      console.log('fortures[i].desc', fortures[i].desc)
      fortures[i].save()
    }
  }
}
