import * as mongoose from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate'
import { Document } from 'mongoose'
interface ICollection extends Document {
  name: String
  desc: String
  userId: String
  //-------Audit field-----------------------
  //create date
  createdAt: Date
  //update
  updatedAt: Date
}

var collectionSchema = new mongoose.Schema(
  {
    name: String,
    desc: String,
    userId: String,
    //-------Audit field-----------------------

    //create date
    createdAt: { type: Date, default: Date.now },
    //update
    updatedAt: { type: Date, default: Date.now },
  },
  {
    usePushEach: true,
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    collection: 'collection',
  },
)

collectionSchema.plugin(mongoosePaginate)
const Collection = mongoose.model('Collection', collectionSchema)

export { ICollection, Collection }
