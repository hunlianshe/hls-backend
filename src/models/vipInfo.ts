import * as mongoose from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate'
import { Document } from 'mongoose'

interface IVipInfo extends Document {
  name: String
  yearPrice: Number
  seasonPrice: Number
  monthPrice: Number
  rightsInfo: [String]
  //-------Audit field-----------------------
  //create date
  createdAt: Date
  //update
  updatedAt: Date
}

var vipInfoSchema = new mongoose.Schema(
  {
    name: String,
    yearPrice: Number,
    seasonPrice: Number,
    monthPrice: Number,
    rightsInfo: [String],

    //-------Audit field-----------------------

    //create date
    createdAt: { type: Date, default: Date.now },
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
    collection: 'vip_info',
  },
)

vipInfoSchema.plugin(mongoosePaginate)
const VipInfo = mongoose.model('vipInfo', vipInfoSchema)

export { IVipInfo, VipInfo }
