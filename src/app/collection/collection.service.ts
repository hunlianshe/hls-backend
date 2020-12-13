import { Injectable } from '@nestjs/common'
import { ICollection, Collection } from '../../models/collection'
import { IProduct } from 'src/models/product'

@Injectable()
export class CollectionService {
  async listCollection(userId: string): Promise<ICollection[]> {
    return await Collection.find({ userId })
  }

  async createCollection(collectionInput: ICollection): Promise<ICollection> {
    return await Collection.create(collectionInput)
  }

  async deleteCollection(
    userId: string,
    collectionId: string,
  ): Promise<ICollection> {
    return await Collection.remove({
      _id: collectionId,
      userId,
    })
  }

  async updateCollection(
    userId: string,
    collectionId: string,
    updateInfo: any,
  ): Promise<ICollection> {
    return await Collection.update(
      {
        _id: collectionId,
        userId,
      },
      {
        $set: {
          ...updateInfo,
        },
      },
    )
  }
}
