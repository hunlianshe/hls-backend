var mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');
import { Document } from 'mongoose';
export interface IUser extends Document {
  email?: string;
  userName?: string;
  password?: string;
  openid?: string;
  registerType: number; //1-email 2-phone
  avatarUrl?: string;
  nickName?: string;
  country?: string;
  phoneCountryCode?: string;
  province?: string;
  city?: string;
  language?: string;
  gender?: number;
  phone?: string;
  code?: string;
  role?: string; //RM  or  CL
  token?: string;
  expireDate?: number;
  active?: number;
  deleteStatus?: boolean;
  //-------Audit field-----------------------
  //create date
  createdAt: Date;
  //update
  updatedAt: Date;
}
var userSchema = new mongoose.Schema(
  {
    //user email
    email: { type: String },
    username: { type: String },
    password: { type: String },
    openid: { type: String, unique: true },
    //user head image
    avatarUrl: { type: String },
    nickName: { type: String },
    country: { type: String },
    phoneCountryCode: { type: String },
    province: { type: String },
    city: { type: String },
    language: { type: String },
    gender: { type: Number },
    phone: { type: String },
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
    collection: 'user',
  },
);

userSchema.plugin(mongoosePaginate);
export const User = mongoose.model('User', userSchema);
