import * as mongoose from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate'
import { Document } from 'mongoose'
import { ProductType, UserLikesTag } from '../types/index'

// 业务逻辑
// 1.注册 -> 发布产品 ->

// 表结构设计
// 1.产品表
// 	名字
// 	产地
// 	产品
// 	货号
// 	发布人id  ->
// 	用户头像和名字
// 	图片url
// 	无水印url
// 	标签

// 2.喜欢和收藏
// 用户id
// 产品id
// [喜欢, 收藏, 足迹]
// 收藏夹id
// 收藏 ->

// 3.
// 收藏夹名称
// 收藏夹

interface IProduct extends Document {
  _id: string
  name: String
  originPlace: String
  productCategory: String
  articleNum: String
  // 加密货号 -> 阿里云
  encryptArticleNum: String
  userId: String
  logoImageUrls: Array<String>
  noLogoImageUrls: Array<String>
  deleted: Boolean
  tag?: UserLikesTag

  //-------Audit field-----------------------
  //create date
  createdAt: Date
  //update
  updatedAt: Date
}

var productSchema = new mongoose.Schema(
  {
    name: String,
    originPlace: String,
    productCategory: String,
    articleNum: String,
    userId: String,
    logoImageUrls: [String],
    noLogoImageUrls: [String],
    encryptArticleNum: String,
    deleted: { type: Boolean, default: false },

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
    collection: 'product',
  },
)

productSchema.plugin(mongoosePaginate)
const Product = mongoose.model('Product', productSchema)

export { IProduct, Product }
