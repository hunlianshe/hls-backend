var mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate')
import { Document } from 'mongoose'
export interface ISystemUser extends Document {
  openid?: string
  userName?: string
  password?: string
  //-------Audit field-----------------------
  //create date
  createdAt: Date
  //update
  updatedAt: Date
}
var ISystemUser = new mongoose.Schema(
  {
    //user email
    openid: { type: String, unique: true },
    username: { type: String, unique: true },
    password: { type: String },

    //create date
    createdAt: { type: Date },
    //update
    updatedAt: { type: Date, default: Date.now },
  },
  {
    usePushEach: true,
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    collection: 'system_user',
  },
)

ISystemUser.plugin(mongoosePaginate)
export const SystemUser = mongoose.model('SystemUser', ISystemUser)
