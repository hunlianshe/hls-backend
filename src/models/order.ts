import * as mongoose from 'mongoose';
import * as mongoosePaginate from 'mongoose-paginate';
import { Document } from 'mongoose';

interface IOrder extends Document {
  orderNum: String;
  userId: String;
  totalPrice: Number;
  isPayed: Boolean;
  productType: String; // coin bronze platinum
  rightsPeriod?: String; // 'month' 'season' 'year',
  payWay: String;
  payMethod: String;
}

var orderSchema = new mongoose.Schema(
  {
    orderNum: { type: String, unique: true },
    userId: String,
    totalPrice: Number,
    isPayed: { type: Boolean, default: false },
    productType: String,
    rightsPeriod: String,
    payWay: String;
    payMethod: String;
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
    collection: 'order',
  },
);

orderSchema.plugin(mongoosePaginate);
const Order = mongoose.model('Order', orderSchema);

export { IOrder, Order };
