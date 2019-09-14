import * as mongoose from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate'
import { Document } from 'mongoose'
interface ISms extends Document {
  phone: String
  code: String
  //-------Audit field-----------------------
  //create date
  createdAt: Date
  expiredAt: Date
  //update
  updatedAt: Date
}

var smsSchema = new mongoose.Schema(
  {
    phone: String,
    code: String,
    //-------Audit field-----------------------
    expiredAt: { type: Date },
    //create date
    createdAt: { type: Date },
    //update
    updatedAt: { type: Date, default: Date.now },
  },
  {
    usePushEach: true,
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    collection: 'sms',
  },
)

smsSchema.plugin(mongoosePaginate)
const Sms = mongoose.model('Sms', smsSchema)

export { ISms, Sms }
