import * as mongoose from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate'
import { Document } from 'mongoose'
interface IFortune extends Document {
  name: String
  birth: String
  attributes: String
  feature: String
  desc: String
  //-------Audit field-----------------------
  //create date
  createdAt: Date
  //update
  updatedAt: Date
}

var fortuneSchema = new mongoose.Schema(
  {
    name: String,
    birth: String,
    attributes: String,
    feature: String,
    desc: String,
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
    collection: 'fortune',
  },
)

fortuneSchema.plugin(mongoosePaginate)
const Fortune = mongoose.model('Fortune', fortuneSchema)

export { IFortune, Fortune }
