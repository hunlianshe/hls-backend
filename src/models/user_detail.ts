import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { Document } from 'mongoose';

interface IUserDetail extends Document {
  openid: String;
  age: Number;
  nickName: String;
  gender: Number;
  birth: String;
  height: String;
  salary: String;
  workProvince: String;
  weChatId: String;
  workCity: String;
  workRegion: String;
  education: String;
  isMarriage: String;
  hasChild: String;
  wantChild: String;
  jobGeneral: String;
  jobDetail: String;
  haveHouse: String;
  phone: String;
  avatarUrl: String;
  photos: [String];
  nationality: String;
  constellation: String;
  isRealAvator: String;
  likes: [String];
  objectInfo: {
    salary: String;
    height: String;
    age: String;
  };
  coin: Number;
  vipType: String;
  vipExpireAt: Date;
  //-------Audit field-----------------------
  //create date
  createdAt: Date;
  //update
  updatedAt: Date;
}

var userDetailSchema = new mongoose.Schema(
  {
    openid: { type: String, unique: true },
    nickName: String,
    gender: Number,
    birth: String,
    height: String,
    age: Number,
    salary: String,
    workProvince: String,
    workCity: String,
    workRegion: String,
    education: String,
    isMarriage: String,
    hasChild: String,
    wantChild: String,
    jobGeneral: String,
    jobDetail: String,
    haveHouse: String,
    phone: String,
    avatarUrl: String,
    photos: [String],
    nationality: String,
    weChatId: String,
    constellation: String,
    isRealAvator: String,
    likes: [String],
    objectInfo: {
      salary: String,
      height: String,
      age: String,
    },
    coin: Number,
    vipType: String,
    vipExpireAt: Date,
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
);

userDetailSchema.plugin(mongoosePaginate);
const UserDetail = mongoose.model('UserDetail', userDetailSchema);

export { IUserDetail, UserDetail };
