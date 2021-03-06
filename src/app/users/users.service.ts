import { Injectable, HttpException } from '@nestjs/common'
import { User, IUser } from '../../models/user'
import { UserDetail } from '../../models/user_detail'
import { SystemUser, ISystemUser } from '../../models/systemUser'
import { IUserDetail } from '../../models/user_detail'
import { ClientService } from '../../lib/client.service'
import { SmsService } from '../../lib/sms.service'
import { Sms } from '../../models/sms'
import * as moment from 'moment'
import { ILikeType } from '../../types/index'
import { ObjectId } from 'mongodb'
import * as _ from 'lodash'

@Injectable()
export class UsersService {
  async findByOpenId(openid: string): Promise<IUser> {
    return await User.findOne({ openid })
  }

  async register(data: IUser): Promise<void> {
    let user = await User.update(
      { openid: data.openid },
      { $set: data },
      { new: true, upsert: true },
    )
    await this.updateUserInfo(data)
    return user
  }

  async getOpenid(code: string): Promise<string> {
    let openidObject = await ClientService.getOpenid(code)
    return openidObject.openid
  }

  async updateUserInfo(user: any): Promise<void> {
    await UserDetail.update(
      { openid: user.openid },
      { $set: user },
      { upsert: true },
    )
  }

  async getUserInfo(openid: string): Promise<any> {
    let user = await UserDetail.findOne({ openid })
    let userNormal = await User.findOne({ openid })
    let keyCount = 0
    const keyArray = [
      'openid',
      'birth',
      'education',
      'gender',
      'height',
      'hasChild',
      'haveHouse',
      'isMarriage',
      'jobGeneral',
      'jobDetail',
      'nickName',
      'avatarUrl',
      'salary',
      'wantChild',
      'workProvince',
      'workCity',
      'workRegion',
      'photos',
      'constellation',
      'objectInfo',
      'phone',
    ]
    for (var key in user) {
      if (keyArray.indexOf(key) > -1 && user[key]) {
        keyCount += 1.0
      }
    }
    moment().format('YYYY.M.D')
    user.finishRate = ((keyCount / keyArray.length) * 100).toFixed(2)
    return {
      ...JSON.parse(JSON.stringify(user)),
      coin: userNormal.coin || 0,
      vipType: userNormal.vipType || '',
      vipExpireAt: userNormal.vipExpireAt || '',
      // coin: user.coin || 0,
      finishRate: ((keyCount / keyArray.length) * 100).toFixed(2),
    }
    // return _.omit(
    //   {
    //     ...JSON.parse(JSON.stringify(user)),
    //     coin: userNormal.coin || 0,
    //     vipType: userNormal.vipType || '',
    //     vipExpireAt: userNormal.vipExpireAt || '',
    //     // coin: user.coin || 0,
    //     finishRate: ((keyCount / keyArray.length) * 100).toFixed(2),
    //   },
    //   ['weChatId'],
    // )
  }

  async like(me: string, openid: string): Promise<void> {
    const user = await UserDetail.findOne({ openid })
    if (!user) {
      throw new HttpException('user not exists', 400)
    }
    await UserDetail.update({ openid: me }, { $addToSet: { likes: openid } })
  }

  async countLike(openid: string): Promise<any> {
    let res = {
      likesMesCount: 0,
      melikesCount: 0,
      likeEachOtherCount: 0,
    }
    const likeMe: [IUserDetail] = await UserDetail.find({ likes: openid })
    res.likesMesCount = likeMe.length || 0
    const userSelf: IUserDetail = await UserDetail.findOne({ openid })
    res.melikesCount = userSelf.likes.length || 0
    likeMe.forEach((user: IUserDetail) => {
      if (userSelf.likes.indexOf(user.openid) !== -1) {
        res.likeEachOtherCount += 1
      }
    })
    return [
      { type: ILikeType.meLike, count: res.melikesCount },
      { type: ILikeType.likeMe, count: res.likesMesCount },
      { type: ILikeType.likeEachOther, count: res.likeEachOtherCount },
    ]
  }

  async listLikes(
    queryType: ILikeType,
    openid: string,
  ): Promise<IUserDetail[]> {
    switch (queryType) {
      case ILikeType.likeMe:
        return await UserDetail.find({ likes: openid })
      case ILikeType.meLike:
        const userMe: IUserDetail = await UserDetail.findOne({ openid })
        return await UserDetail.find({ openid: { $in: userMe.likes } })
      default:
        const likeEachOtherIds = []
        const likeMe: [IUserDetail] = await UserDetail.find({ likes: openid })
        const userSelf: IUserDetail = await UserDetail.findOne({ openid })
        likeMe.forEach((user: IUserDetail) => {
          if (userSelf.likes.indexOf(user.openid) !== -1) {
            likeEachOtherIds.push(user.openid)
          }
        })
        return await UserDetail.find({ openid: { $in: likeEachOtherIds } })
    }
  }

  async sendSms(phone: string): Promise<void> {
    let code = Math.random()
      .toFixed(6)
      .slice(-6)
    let sms = new Sms({ code, phone, expiredAt: moment() })
    sms.save()
    return await SmsService.sendSms(phone, code)
  }

  async addPhone(phone: string, code: string, openid: string): Promise<void> {
    let sms = await Sms.findOne({ phone, code })
    if (!sms) throw new HttpException('验证码已过期,请重新发送', 400)
    await UserDetail.update({ openid }, { $set: { phone } })
    await Sms.remove({ phone, code })
  }

  async adminLogin(username: string, password: string): Promise<ISystemUser> {
    return await SystemUser.findOne({ username, password })
  }

  async listUsers(id: string, gender: number): Promise<IUserDetail[]> {
    if (id === '') {
      return await UserDetail.find({
        gender: { $ne: gender },
      })
        .sort({ _id: -1 })
        .limit(10)
    } else {
      return await UserDetail.find({
        _id: { $lt: ObjectId(id) },
        gender: { $ne: gender },
      })
        .sort({ _id: -1 })
        .limit(10)
    }
  }

  /*
  {
    age: {
      from: 30
      to: 40
    },
    height: {
      from: 170,
      to: 180
    }
    salary: string
  }
  */
  async listUsersWithParam(body, user): Promise<any> {
    const { gender } = user
    const { objectId, age, height, salary } = body

    const whereOptions: any = {
      gender: { $ne: gender },
    }
    if (age) {
      if (age.from) {
        whereOptions.age = {
          ...whereOptions.age,
          $gte: age.from,
        }
      }
      if (age.to) {
        whereOptions.age = {
          ...whereOptions.age,
          $lte: age.to,
        }
      }
    }
    if (height) {
      if (height.from) {
        whereOptions.height = {
          ...whereOptions.height,
          $gte: height.from,
        }
      }
      if (height.to) {
        whereOptions.height = {
          ...whereOptions.height,
          $lte: height.to,
        }
      }
    }

    if (salary) {
      whereOptions.salary = salary
    }

    if (objectId !== '') {
      whereOptions._id = { $lt: ObjectId(objectId) }
    }

    return await UserDetail.find(whereOptions)
      .sort({ _id: -1 })
      .limit(10)
  }

  async adminuserlist(body): Promise<IUserDetail[]> {
    if (body.nickName) body.nickName = new RegExp(body.nickName, 'gi')
    return await UserDetail.find(body)
  }

  async getAvator(openid: string) {
    const group = await User.findOne({ openid })
    return group.avatarUrl
  }
}
