import * as mongoose from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate'
import { Document } from 'mongoose'
interface IPsychologicalTest extends Document {
  name: String
  content: [
    {
      question: String
      answerOptions: [
        {
          optionIndex: String
          optionContent: String
        },
      ]
    },
  ]
  //-------Audit field-----------------------
  //create date
  createdAt: Date
  //update
  updatedAt: Date
}

var psychologicalTestSchema = new mongoose.Schema(
  {
    name: String,
    content: [
      {
        question: String,
        answerOptions: [
          {
            optionIndex: String,
            optionContent: String,
          },
        ],
      },
    ],

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
    collection: 'psychologicalTest',
  },
)

psychologicalTestSchema.plugin(mongoosePaginate)
const PsychologicalTest = mongoose.model(
  'PsychologicalTest',
  psychologicalTestSchema,
)

export { IPsychologicalTest, PsychologicalTest }
