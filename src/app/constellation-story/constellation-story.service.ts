import { Injectable } from '@nestjs/common'
import {
  IConstellationStory,
  ConstellationStory,
} from '../../models/constellationStory'

@Injectable()
export class ConstellationStoryService {
  async listStory(constellation: string): Promise<IConstellationStory> {
    return await ConstellationStory.findOne({ constellation })
  }
}
