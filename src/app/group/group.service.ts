import { HttpException, Injectable } from '@nestjs/common'
import { Message } from '../../models/message'
import { Group } from '../../models/group'

@Injectable()
export class GroupService {
  async createGroup(userIds: Array<string>, createId: string) {
    const group = await Group.findOne({ userIds: userIds[0] })
    if (group) {
      return group
    }
    await Group.update(
      { userIds: userIds[0] },
      { $set: { userIds }, createId },
      { new: true, upsert: true },
    )
    return await Group.findOne({ userIds: userIds[0] })
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
    const groups = await Group.find({ userIds: openid })
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
    const group = await Group.findOne({ _id: cid, userIds: openid })
    if (!group) {
      throw new HttpException('你不在当前会话，不能更新', 400)
    }
    await Message.update(
      { 'status.openid': openid },
      { $set: { 'status.$.msgUnRead': false } },
      { $multi: true },
    )
  }

  async getConversationUnreadMessageCount(cid: string, openid: string) {
    return await Message.count({
      cid,
      'status.openid': openid,
      'status.msgUnRead': true,
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
