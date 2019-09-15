import * as mongoose from 'mongoose'
import * as mongoosePaginate from 'mongoose-paginate'
import { Document } from 'mongoose'
interface IConstellationStory extends Document {
  constellation: string
  storyTitle: string
  storyContent: string
  imageUrl: string
  //-------Audit field-----------------------
  //create date
  createdAt: Date
  //update
  updatedAt: Date
}

var constellationStorySchema = new mongoose.Schema(
  {
    constellation: String,
    storyTitle: String,
    storyContent: String,
    imageUrl: String,
    //-------Audit field-----------------------
    // <br></br><br></br>
    //create date
    createdAt: { type: Date },
    //update
    updatedAt: { type: Date, default: Date.now },
  },
  {
    usePushEach: true,
    versionKey: false,
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
    collection: 'constellation_story',
  },
)

constellationStorySchema.plugin(mongoosePaginate)
const ConstellationStory = mongoose.model(
  'ConstellationStory',
  constellationStorySchema,
)

export { IConstellationStory, ConstellationStory }
