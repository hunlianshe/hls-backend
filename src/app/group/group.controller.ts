import { Controller, Post, Req, Body, Get, Put } from '@nestjs/common'
import { GroupService } from './group.service'
import { AjvService } from '../../lib/ajv.service'

@Controller('group')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  /**
  @apiGroup Group
  @apiVersion 0.1.0
  @api {post} /group/create  发起聊天
 @apiParamExample {json} Request-Example:
{
	"userIds": ["18818216454"]
}

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 
{
    "data": {
        "userIds": [
            "18818216454",
            "oHgB55AlhKqR7azr85YYBwfIE9EQ"
        ],
        "_id": "5f549a12bb97350949bd8a99",
        "createdAt": "2020-09-06T08:13:06.152Z",
        "createId": "oHgB55AlhKqR7azr85YYBwfIE9EQ",
        "updatedAt": "2020-09-06T08:21:31.443Z"
    },
    "code": 200,
    "message": "success"
}

  @apiErrorExample Error-Response:
      HTTP/1.1 200 
  {
  code:500
  msg:"Internal Error",
  }
    {
  code:400
  msg:"用户名或则密码错误"",
  }
 */

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
    let openid = req.user.openid
    body.userIds.push(openid)
    return await this.groupService.createGroup(body.userIds, openid)
  }

  /**
  @apiGroup Group
  @apiVersion 0.1.0
  @api {get} /group/get-group-by-id/:id 查询单个聊天详细信息
 @apiParamExample {json} Request-Example:
{
	"userIds": ["18818216454"]
}

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 
{
    "data": {
        "userIds": [
            "oHgB55LJ1wGo2QqEYxgo8tLMxL4A",
            "oHgB55AlhKqR7azr85YYBwfIE9EQ"
        ],
        "_id": "5f66e025bb97350949c52a97",
        "createId": "oHgB55AlhKqR7azr85YYBwfIE9EQ",
        "createdAt": "2020-09-20T04:52:53.115Z",
        "updatedAt": "2020-09-20T07:57:43.815Z",
        "lastMessage": {
            "cid": "5f66e025bb97350949c52a97",
            "type": 1,
            "msg": "hello lisa",
            "status": [
                {
                    "openid": "oHgB55LJ1wGo2QqEYxgo8tLMxL4A",
                    "msgUnread": true
                },
                {
                    "openid": "oHgB55AlhKqR7azr85YYBwfIE9EQ",
                    "msgUnread": true
                }
            ],
            "from": "oV2Js5THL6EdzDahAxCTxFoXyjHk",
            "fromName": "刘祖宽",
            "fromAvatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erbAfZ10K9richIBTz7kDsA9lUsVyzicShXgxw9zeMfekOUk6s7JGOVtCza5veuxvibsJyOOgVICwpPQ/132"
        }
    },
    "code": 200,
    "message": "success"
}

  @apiErrorExample Error-Response:
      HTTP/1.1 200 
  {
  code:500
  msg:"Internal Error",
  }
    {
  code:400
  msg:"用户名或则密码错误"",
  }
 */

  @Get('/get-group-by-id/:id')
  async getGroup(@Req() req: any): Promise<any> {
    return await this.groupService.getGroupById(req.user.openid, req.params.id)
  }

  /**
  @apiGroup Group
  @apiVersion 0.1.0
  @api {get} /group/list  查询我参与的聊天

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

{
    "data": [
        {
            "_id": "5f66e025bb97350949c52a97",
            "userIds": [
                "oHgB55LJ1wGo2QqEYxgo8tLMxL4A",
                "oHgB55AlhKqR7azr85YYBwfIE9EQ"
            ],
            "createId": "oHgB55AlhKqR7azr85YYBwfIE9EQ",
            "createdAt": "2020-09-20T04:52:53.115Z",
            "updatedAt": "2020-09-20T07:57:43.815Z",
            "lastMessage": {
                "cid": "5f66e025bb97350949c52a97",
                "type": 1,
                "msg": "hello lisa",
                "status": [
                    {
                        "openid": "oHgB55LJ1wGo2QqEYxgo8tLMxL4A",
                        "msgUnread": true
                    },
                    {
                        "openid": "oHgB55AlhKqR7azr85YYBwfIE9EQ",
                        "msgUnread": true
                    }
                ],
                "from": "oV2Js5THL6EdzDahAxCTxFoXyjHk",
                "fromName": "刘祖宽",
                "fromAvatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/DYAIOgq83erbAfZ10K9richIBTz7kDsA9lUsVyzicShXgxw9zeMfekOUk6s7JGOVtCza5veuxvibsJyOOgVICwpPQ/132"
            },
            "unreadCount": 20
        }
    ],
    "code": 200,
    "message": "success"
}
  @apiErrorExample Error-Response:
      HTTP/1.1 200 
  {
  code:500
  msg:"Internal Error",
  }
    {
  code:400
  msg:"用户名或则密码错误"",
  }
 */
  @Get('/list')
  async List(@Req() req: any): Promise<any> {
    return await this.groupService.list(req.user.openid)
  }

  /**
  @apiGroup Group
  @apiVersion 0.1.0
  @api {put} /group/message/read-all/:cid  更新消息为已读

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

{
    "code": 200,
    "message": "success"
}

  @apiErrorExample Error-Response:
      HTTP/1.1 200 
  {
  code:500
  msg:"Internal Error",
  }
    {
  code:400
  msg:"你不在当前会话，不能更新",
  }
 */
  @Put('/message/read-all/:cid')
  async readAll(@Req() req: any): Promise<any> {
    return await this.groupService.readAll(req.user.openid, req.params.cid)
  }

  /**
  @apiGroup Group
  @apiVersion 0.1.0
  @api {get} /group//message/list/:cid?pageSize=1&pageToken=  查询单个聊天消息

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

{
    "data": {
        "nextPageToken": 1,
        "result": [
            {
                "_id": "5f66e2f82735248c31b97bd8",
                "type": 1,
                "cid": "5f66e025bb97350949c52a97",
                "msg": "hello lisa",
                "status": [
                    {
                        "msgUnRead": false,
                        "_id": "5f66e2f82735248c31b97bda",
                        "openid": "oHgB55LJ1wGo2QqEYxgo8tLMxL4A"
                    },
                    {
                        "msgUnRead": true,
                        "_id": "5f66e2f82735248c31b97bd9",
                        "openid": "oHgB55AlhKqR7azr85YYBwfIE9EQ"
                    }
                ],
                "from": "oHgB55LJ1wGo2QqEYxgo8tLMxL4A",
                "updatedAt": "2020-09-20T05:04:56.688Z",
                "createdAt": "2020-09-20T05:04:56.688Z"
            }
        ]
    },
    "code": 200,
    "message": "success"
}

  @apiErrorExample Error-Response:
      HTTP/1.1 200 
  {
  code:500
  msg:"Internal Error",
  }
    {
  code:400
  msg:"你不在当前会话，不能更新",
  }
 */
  @Get('/message/list/:cid')
  async messageList(@Req() req: any): Promise<any> {
    const body = req.query
    let pageSize = body.pageSize || 50
    let pageToken = body.pageToken || 0
    pageSize = parseInt(pageSize)
    pageToken = parseInt(pageToken)
    return await this.groupService.messageList(
      req.user.openid,
      req.params.cid,
      pageSize,
      pageToken,
    )
  }
}
