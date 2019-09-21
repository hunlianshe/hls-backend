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

  async constellationMmatchingComplex(
    openid: string,
    type = 'easy',
  ): Promise<any> {
    let user = await UserDetail.findOne({ openid })
    console.log('are you coming', user)
    let model: any = {}
    let opposite
    if (user.gender === 1) {
      opposite = await UserDetail.findOne({
        gender: 2,
        'objectInfo.salary': { $exists: true },
      })
      model = {
        salary: user.salary
          ? RulesService.generateSalaryScore(user.salary, opposite.salary)
          : null,
        height: user.salary
          ? RulesService.generateHeightScore(user.height, opposite.height)
          : null,
        age: user.salary
          ? RulesService.generateAgeScore(user.age, opposite.age)
          : null,
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
        salary: user.salary
          ? RulesService.generateSalaryScore(opposite.salary, user.salary)
          : null,
        height: user.height
          ? RulesService.generateHeightScore(opposite.height, user.height)
          : null,
        age: user.age
          ? RulesService.generateAgeScore(opposite.age, user.age)
          : null,
        average: user.age
          ? RulesService.generateAgeScore(opposite.age, user.age)
          : null,
        star: await ClientService.constellationMmatching(
          `?me=${opposite.constellation}&he=${user.constellation}`,
        ),
      }
    }
    model.me = {
      openid: user.openid,
      avatarUrl: user.avatarUrl || user.avatar,
    }
    model.opposite = {
      openid: opposite.openid,
      avatarUrl: opposite.avatarUrl || user.avatar,
    }
    model.average = Math.ceil((model.salary + model.height + model.age) / 3)
    if (model.average === 0) model.average = 80
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
