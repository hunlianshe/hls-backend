import { Controller, Get, Post, Param, Body, Req, Put } from '@nestjs/common'
import { UserLikesService } from './userLikes.service'
import { IUserLikes } from '../../models/user_likes'
import { AjvService } from '../../lib/ajv.service'

@Controller('userlikes')
export class UserLikesController {
  constructor(private readonly userLikesServcie: UserLikesService) {}

  @Post('/create')
  async create(@Req() req: any, @Body() body: any): Promise<any> {
    const user = req.user
    body.userId = user._id
    const validator = {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        productId: { type: 'string' },
        tag: { type: 'string', enum: ['like', 'collect', 'look'] },
        collectionId: { type: 'string' },
      },
      required: ['userId', 'productId', 'tag', 'collectionId'],
    }
    AjvService.verify(body, validator)
    return await this.userLikesServcie.create(body)
  }

  @Put('/update')
  async update(@Req() req: any, @Body() body: any): Promise<any> {
    const user = req.user
    body.userId = user._id
    const validator = {
      type: 'object',
      properties: {
        collectionId: { type: 'string' },
      },
      required: ['collectionId'],
    }
    AjvService.verify(body, validator)
    return await this.userLikesServcie.update({ _id: body.collectionId }, body)
  }

  @Post('/like')
  async like(@Req() req: any, @Body() body: any): Promise<any> {
    const user = req.user
    body.userId = user._id
    const validator = {
      type: 'object',
      properties: {
        userId: { type: 'string' },
        productId: { type: 'string' },
        tag: { type: 'string', enum: ['like', 'collect', 'look'] },
        collectionId: { type: 'string' },
        like: { type: 'boolean' },
      },
      required: ['userId', 'productId', 'tag', 'like'],
    }
    AjvService.verify(body, validator)
    return await this.userLikesServcie.like(body)
  }
}
