import * as mongoose from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate'
import { Document } from 'mongoose'
interface IMessage extends Document {
  cid: String
  status: [
    {
      openid: String
      msgUnRead: Boolean
    },
  ]
  from: String
  type: number
  msg: Boolean
  //-------Audit field-----------------------
  //create date
  createdAt: Date
  expiredAt: Date
  //update
  updatedAt: Date
}

var messageSchema = new mongoose.Schema(
  {
    cid: String,
    status: [
      {
        openid: String,
        msgUnRead: { type: Boolean, default: true },
      },
    ],
    from: { type: String, required: true },
    type: { type: Number, default: 1 }, //1-文字，2-图片
    msg: String,
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
    collection: 'message',
  },
)

messageSchema.plugin(mongoosePaginate)
const Message = mongoose.model('Message', messageSchema)

export { IMessage, Message }
