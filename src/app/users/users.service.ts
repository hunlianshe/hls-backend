import { Injectable, HttpException } from '@nestjs/common'
import { User, IUser } from '../../models/user'
import { UserDetail } from '../../models/user_detail'
import { IUserDetail } from '../../models/user_detail'
import { ClientService } from '../../lib/client.service'
import { SmsService } from '../../lib/sms.service'
import { Sms } from '../../models/sms'
import * as moment from 'moment'
import { ILikeType } from '../../types/index'

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

  async getUserInfo(openid: string): Promise<IUserDetail> {
    return await UserDetail.findOne({ openid })
  }

  async like(me: string, openid: string): Promise<void> {
    const user = UserDetail.findOne({ openid })
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
    res.likeEachOtherCount = likeMe.length || 0
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
}
