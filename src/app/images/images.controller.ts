import { Controller, Get, Post, Req } from '@nestjs/common'
import { AjvService } from '../../lib/ajv.service'
import { ImagesService } from './images.service'

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}
  @Post('/search/picture')
  async constellationMmatchingComplex(@Req() request: any): Promise<any> {
    const validator = {
      type: 'object',
      properties: {
        id: { type: 'string' },
      },
      required: ['url'],
    }

    const body = request.body
    AjvService.verify(body, validator)
    return await this.imagesService.searchPicture(request.body.url)
  }
}
