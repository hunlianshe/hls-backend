import * as mongoose from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate'
import { Document } from 'mongoose'
import { IProduct } from './product'

interface IUserLikes extends Document {
  _id: string
  userId: string
  productId: string
  tags: string[]
  collectionId: string
  product: IProduct
  //-------Audit field-----------------------
  //create date
  createdAt: Date
  //update
  updatedAt: Date
}

var userLikesSchema = new mongoose.Schema(
  {
    userId: String,
    productId: String,
    tags: [String],
    collectionId: String,
    //-------Audit field-----------------------
    //create date
    createdAt: { type: Date },
    //update
    updatedAt: { type: Date, default: Date.now },
  },
  {
    usePushEach: true,
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    collection: 'user_likes',
  },
)

userLikesSchema.plugin(mongoosePaginate)
const UserLikes = mongoose.model('UserLikes', userLikesSchema)

export { IUserLikes, UserLikes }
