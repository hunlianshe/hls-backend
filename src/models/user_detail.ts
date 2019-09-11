import * as mongoose from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate'
import { Document } from 'mongoose'

interface IUserDetail extends Document {
  openid: String
  nickName: String
  gender: Number
  birth: String
  height: Number
  month_incomeRange: String
  work_province: String
  work_city: String
  work_region: String
  education: String
  marital_status: Boolean
  with_child: Boolean
  want_child: Boolean
  job_general: String
  job_detail: String
  have_house: Boolean
  phone: String
  avator: String
  photos: [String]
  nationality: String
  constellation: String
  isRealAvator: Boolean
  likes: [String]
  objectInfo: {
    income: String
    height: String
    age: String
  }
  //-------Audit field-----------------------
  //create date
  createdAt: Date
  //update
  updatedAt: Date
}

var userDetailSchema = new mongoose.Schema(
  {
    openid: { type: String, unique: true },
    nickName: String,
    gender: Number,
    birth: String,
    height: Number,
    month_incomeRange: String,
    work_province: String,
    work_city: String,
    work_region: String,
    education: String,
    marital_status: Boolean,
    with_child: Boolean,
    want_child: Boolean,
    job_general: String,
    job_detail: String,
    have_house: Boolean,
    phone: String,
    avator: String,
    photos: [String],
    nationality: String,
    constellation: String,
    isRealAvator: Boolean,
    likes: [String],
    objectInfo: {
      income: String,
      height: String,
      age: String,
    },
    //-------Audit field-----------------------

    //create date
    createdAt: { type: Date },
    //update
    updatedAt: { type: Date, default: Date.now },
  },
  {
    usePushEach: true,
    versionKey: false,
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
    collection: 'user_detail',
  },
)

userDetailSchema.plugin(mongoosePaginate)
const UserDetail = mongoose.model('UserDetail', userDetailSchema)

export { IUserDetail, UserDetail }
