import { Injectable } from '@nestjs/common'
import { IUserLikes, UserLikes } from '../../models/user_likes'
import { ClientService } from '../../lib/client.service'
import { UserDetail } from '../../models/user_detail'
import { RulesService } from '../../lib/rules.service'
import { UserLikesTag } from '../../types'
import { Collection, ICollection } from '../../models/collection'
import { IProduct } from '../../models/product'
import { User } from '../../models/user'

@Injectable()
export class UserLikesService {
  async create(input: IUserLikes): Promise<IUserLikes> {
    return await UserLikes.create(input)
  }

  async update(where: any, updateContent: any): Promise<IUserLikes> {
    return await UserLikes.update(where, {
      $set: updateContent,
    })
  }

  async like(input: any & { like: boolean }): Promise<IUserLikes> {
    const likeRecord: IUserLikes = await UserLikes.find({
      userId: input.userId,
      productId: input.productId,
    })
    if (!likeRecord && input.like) {
      return await UserLikes.create({
        ...input,
        tags: [input.tag],
      })
    }
    let tags = likeRecord.tags
    if (input.like) {
      if (tags.indexOf(input.tag) === -1) {
        tags = [...tags, input.tag]
      }
    } else {
      if (tags.indexOf(input.tag) !== -1) {
        // remove tag
        tags.splice(tags.findIndex(item => item === input.tag), 1)
      }
    }
    return await UserLikes.update(
      {
        _id: likeRecord._id,
      },
      {
        $set: {
          tags,
        },
      },
    )
  }
}
