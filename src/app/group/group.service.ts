import { Injectable } from '@nestjs/common'
import { Group } from '../../models/group'

@Injectable()
export class GroupService {
  async createGroup(userIds: Array<string>) {
    return await Group.update(
      { userIds: userIds },
      { $set: userIds },
      { upsert: true },
    )
  }
}
