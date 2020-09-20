var mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
import { Document } from 'mongoose'
export interface IGroup extends Document {
  cid?: String
  userIds?: Array<String>
  createId: String
  //-------Audit field-----------------------
  //create date
  createdAt: Date
  //update
  updatedAt: Date
}
var groupSchema = new mongoose.Schema(
  {
    //user email
    cid: { type: String },
    createId: { type: String },
    userIds: { type: Array },
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
    collection: 'groups',
  },
)

groupSchema.plugin(mongoosePaginate)
export const Group = mongoose.model('Group', groupSchema)
