import { Injectable, HttpException } from '@nestjs/common'
import { Product, IProduct } from '../../models/product'
import { filterCatOrDog, analyzeReport } from '../../filters/filterAnswer'
import * as _ from 'lodash'
import { IPastLove, UserLikesTag } from '../../types'
import { User } from '../../models/user'
// import { UserLikes, IUserLikes } from 'src/models/userLikes';
import { UserLikes, IUserLikes } from '../../models/user_likes'
import { ObjectId } from 'mongodb'

@Injectable()
export class ProductService {
  async listlike(userId: string, query: any): Promise<IProduct[]> {
    const whereOptions: any = {
      userId,
      tags: {
        $all: [query.tag],
      },
    }
    if (query.objectId) {
      whereOptions._id = {
        $lt: ObjectId(query.objectId),
      }
    }

    let likesRecord: any = await UserLikes.find(whereOptions)
      .sort({
        _id: -1,
      })
      .limit(10)
    const likesRecordIds = likesRecord.map(rec => {
      return rec.productId
    })
    const productLists = await Product.find({
      _id: {
        $in: likesRecordIds,
      },
    })
    likesRecord = likesRecord.map((rec: IUserLikes) => {
      rec.product = {
        ...productLists.filter((pro: IProduct) => pro._id === rec.productId)[0],
        tags: rec.tags,
      }
      return rec
    })

    return likesRecord
  }

  async list(query: any): Promise<IProduct[]> {
    const whereOptions: any = {}
    if (query.objectId) {
      whereOptions._id = {
        $lt: ObjectId(query.objectId),
      }
    }
    let products: IProduct[] = await Product.find(whereOptions)
      .sort({
        _id: -1,
      })
      .limit(10)
    const productIds = products.map((pro: IProduct) => pro._id)
    const likesRecord = await UserLikes.find({
      productId: {
        $in: productIds,
      },
    })
    return products.map((pro: IProduct) => {
      const likeRecord: IUserLikes[] = likesRecord.filter(
        (l: IUserLikes) => pro._id === l.productId,
      )
      if (likeRecord.length < 1) {
        return pro
      }
      return {
        ...pro,
        tags: likeRecord[0].tags,
      }
    })
  }

  async create(input: IProduct): Promise<IProduct> {
    const productInfo = await Product.findOne({
      articleNum: input.articleNum,
    })
    if (productInfo) {
      throw new HttpException('product exist', 400)
    }
    return await Product.create(input)
  }

  async update(id: string, input: any): Promise<IProduct> {
    console.log(input)
    return await Product.update(
      {
        _id: id,
      },
      {
        $set: {
          ...input,
        },
      },
      { new: true, upsert: true },
    )
  }

  async delete(id: string): Promise<IProduct> {
    return await Product.update(
      {
        _id: id,
      },
      {
        $set: {
          deleted: true,
        },
      },
      { upsert: false },
    )
  }
}
