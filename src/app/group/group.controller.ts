import { Controller, Post, Req, Body } from '@nestjs/common'
import { GroupService } from './group.service'
import { AjvService } from '../../lib/ajv.service'

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post('/create')
  async createGroup(@Req() req: any, @Body() body: any): Promise<any> {
    let validator = {
      type: 'object',
      properties: {
        userIds: { type: 'array' },
      },
      required: ['userIds'],
    }

    AjvService.verify(body, validator)
    return await this.groupService.createGroup(body.userIds)
  }
}
