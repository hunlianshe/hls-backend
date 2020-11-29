import { HttpException, Injectable } from '@nestjs/common'
import { Message } from '../../models/message'
import { Group } from '../../models/group'
import { User } from '../../models/user'

@Injectable()
export class GroupService {
  async createGroup(userIds: Array<string>, createId: string, me: any) {
    const group = await Group.findOne({ 'users.openid': { $all: userIds } })
    if (group) {
      return group
    }

    let toOpenId
    if (userIds.length === 2) {
      userIds.forEach(userId => {
        if (userId !== createId) {
          toOpenId = userId
        }
      })
    }

    let toUser = await User.findOne({ openid: toOpenId })

    const users = [
      {
        nickName: toUser.nickName,
        openid: toUser.openid,
      },
      {
        nickName: me.nickName,
        openid: me.openid,
      },
    ]

    let groupSchema = new Group({
      createId,
      users,
      groupName: toUser.nickName,
    })
    return await groupSchema.save()
  }

  async getGroupById(openid: string, _id: string) {
    const group = await Group.findOne({ _id })
    group.unreadCount = await this.getConversationUnreadMessageCount(
      group._id,
      openid,
    )
    return group
  }

  /**
   * @desc 查询我参与的所有聊天
   * @param openid 用户id
   */
  async list(openid: string) {
    const groups = await Group.find({
      'users.openid': openid,
      lastMessage: { $exists: true },
    })
      .sort({ updatedAt: -1 })
      .lean()
    return await Promise.all(
      groups.map(async group => {
        group.unreadCount = await this.getConversationUnreadMessageCount(
          group._id,
          openid,
        )
        return group
      }),
    )
  }

  async readAll(openid: string, cid: string) {
    const group = await Group.findOne({ _id: cid, 'users.openid': openid })
    if (!group) {
      throw new HttpException('你不在当前会话，不能更新', 400)
    }
    console.log('openid-->', openid)
    await Message.updateMany(
      { 'status.openid': openid },
      { $set: { 'status.$.msgUnRead': false } },
    )
  }

  async getConversationUnreadMessageCount(cid: string, openid: string) {
    let result = await Message.find({
      cid,
      status: {
        $elemMatch: {
          openid: openid,
          msgUnRead: true,
        },
      },
    })
    console.log('result', JSON.stringify(result))
    return await Message.count({
      cid,
      status: {
        $elemMatch: {
          openid: openid,
          msgUnRead: true,
        },
      },
    })
  }

  async messageList(
    openid: string,
    cid: string,
    pageSize: number = 50,
    pageToken: number = 0,
  ) {
    const result = await Message.find({ cid, 'status.openid': openid })
      .skip(pageToken)
      .limit(pageSize)
      .sort({ createdAt: -1 })
      .lean()
    return {
      nextPageToken: result.length < pageSize ? '' : pageToken + pageSize,
      result,
    }
  }
}
