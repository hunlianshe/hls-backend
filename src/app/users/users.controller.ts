import { UsersService } from './users.service'
import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common'
import { IUser } from '../../models/user'
import { AjvService } from '../../lib/ajv.service'
import { SecureService } from '../../lib/secure.service'
import { IUserDetail } from '../../models/user_detail'

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  /**
  @apiGroup User
  @apiVersion 0.1.0
  @api {get} /users/openidfromwx/:code 从微信获取openid

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

{
   data:{
"openid":"oV2Js5THL6EdzDahAxCTxFoXyjHk"
   } 
   code:200
}
  @apiErrorExample Error-Response:
      HTTP/1.1 200 
  {
  code:500,
  msg:""
  }  
 */

  @Get('openidfromwx/:code')
  async getOpenid(@Param() params): Promise<any> {
    return {
      openid: await this.userService.getOpenid(params.code),
    }
  }

  @Get(':openid')
  async findByOpenId(@Param() params): Promise<IUser> {
    return this.userService.findByOpenId(params.openid)
  }

  /**
  @apiGroup User
  @apiVersion 0.1.0
  @api {post} http://localhost:8009/users/sendSms  发送短信接口
  
  @apiParamExample {json} Request-Example:
    {
      "phone":"18818216454",
    }
  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 
    {
    "data": {
        "Message": "OK",
        "RequestId": "F8F33217-DD96-4057-BBCC-539D5BD58CD3",
        "BizId": "836213868437871773^0",
        "Code": "OK"
    },
    "code": 200,
    "message": "success"
}

  @apiErrorExample Error-Response:
      HTTP/1.1 200 
  {
  code:500,
  msg:""
  }  
 */
  @Post('sendSms')
  async sendSms(@Body() body: any): Promise<any> {
    return await this.userService.sendSms(body.phone)
  }

  /**
  @apiGroup User
  @apiVersion 0.1.0
  @api {post} /users/register  创建用户
 @apiParamExample {json} Request-Example:
 {
      "nickName": "A、double",
      "language": "zh_CN",
      "city": "Fayetteville",
      "province": "Arkansas",
      "country": "United States",
      "avatarUrl": "https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTLLnJRJkI86CSPQNoMsSicNmwjl6W5k7R9kM2PPvp7EoamyUSWr64Vibdy4l3AZOPZ2H32w7IdJAYpA/132",
      "openid": "1212121212",
      "deleteStatus": false
    }


  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 
{
    "code": "200",
    "data": {
        "token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MiwiaWF0IjoxNTQzNjUyMDQ4fQ.NufQtcGh8QK4-eFuDUJVpIESWdgoIt121FQksZ48ip0"
    }
}

  @apiErrorExample Error-Response:
      HTTP/1.1 200 
  {
  code:400
  msg:"the openid is not exists",
  }
 */

  @Post('register')
  async save(@Body() user: any): Promise<any> {
    let validator = {
      type: 'object',
      properties: {
        openid: { type: 'string' },
      },
      required: ['openid'],
    }
    AjvService.verify(user, validator)
    console.log('user', user)
    await this.userService.register(user)
    return {
      token: SecureService.generateToken(user.openid),
    }
  }

  /**
  @apiGroup User
  @apiVersion 0.1.0
  @api {post} /users/addPhone  手机注册
 @apiParamExample {json} Request-Example:
 {
	"phone":"18818216454", //只是补充信息，需要加token
	"code":"812901" 
}

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 
   {
    "code": 200,
    "message": "success"
   }

  @apiErrorExample Error-Response:
      HTTP/1.1 200 
  {
  code:400
  msg:"the openid is not exists",
  }
 */

  @Post('addPhone')
  async addPhone(@Body() body: any, @Req() req: any): Promise<any> {
    let validator = {
      type: 'object',
      properties: {
        phone: { type: 'string' },
      },
      required: ['phone', 'code'],
    }
    let user: any = req.user
    AjvService.verify(body, validator)
    await this.userService.addPhone(body.phone, body.code, user.openid)
  }

  /**
  @apiGroup User
  @apiVersion 0.1.0
  @api {post} http://localhost:8009/users/updateUserInfo  更新和创建用户信息
 @apiParamExample {json} Request-Example:
{
  "openid": "2", // wx openid - string
  "name": "刘宽", // 昵称  - string
  "gender": 1, //性别 - number
  "birth": "1995-2-4", //生日 - string
  "height": 183, //升高 - string
  "salary": "1000-1500", //月收入 - string
  "workProvince": "江苏省", // 工作 省 - string
  "workCity": "无锡市", // 工作 市 - string
  "workRegion": "滨湖区", // 工作 区 - string
  "education": "本科", // 学历 - string
  "isMarriage": 否, // 是否已婚 没有值->请选择 - string
  "hasChild": 否, // 是否有孩子 - string
  "wantChild": 是, // 是否想要孩子 - string
  "jobGeneral": "计算机", // 工作类型的大类别 - string
  "jobDetail": "程序员", // 工作类型的小类别 - string
  "haveHouse": 是 // 是否有房子 - string
  "phone": "17602131394" // 电话号码 - string
  "avator": "https://photo.zastatic.com/images/cms/banner/20181121/8311191311554389.png", // 头像
  "photos": [
            "https://photo.zastatic.com/images/photo/467571/1870282366/960647145683513.png", // 用户图片
            ....
        ],
  "nationality": "汉族", // 名族
  "constellation": "魔羯座(12.22-01.19)", //星座
  "isRealAvator": 是 //是否是真人头像
  "likes": ["1"], // 我喜欢的人的列表
  "objectInfo": { // 配偶标准要求
            "salary": "月薪:2万-5万", // 收入
            "height": "178cm以上", // 身高
            "age": "23-37岁", // 年龄
        }
}



  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 
{
    "data": "success",
    "code": 200,
    "message": "success"
}

  @apiErrorExample Error-Response:
      HTTP/1.1 200 
 {
    "message": "should have required property 'openid'",
    "code": 400,
    "url": "/users/updateUserInfo"
}
 */
  @Post('updateUserInfo')
  async updateUserInfo(@Body() user: any, @Req() req: any): Promise<any> {
    user.openid = req.user.openid
    await this.userService.updateUserInfo(user)
    return 'success'
  }

  /**
  @apiGroup User
  @apiVersion 0.1.0
  @api {get} http://localhost:8009/users/getUserInfo  获取用户信息
 
  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 
   {
     code:200,
     data:{
  "openid": "2", // wx openid - string
  "name": "刘宽", // 昵称  - string
  "gender": 1, //性别 - number
  "birth": "1995-2-4", //生日 - string
  "height": 183cm, //升高 - number
  "salary": "1000-1500", //月收入 - string
  "workProvince": "江苏省", // 工作 省 - string
  "workCity": "无锡市", // 工作 市 - string
  "workRegion": "滨湖区", // 工作 区 - string
  "education": "本科", // 学历 - string
  "isMarriage": 否, // 是否已婚 没有值->请选择 - string
  "hasChild": 否, // 是否有孩子 - string
  "wantChild": 是, // 是否想要孩子 - string
  "jobGeneral": "计算机", // 工作类型的大类别 - string
  "jobDetail": "程序员", // 工作类型的小类别 - string
  "haveHouse": 是 // 是否有房子 - string
  "phone": "17602131394" // 电话号码 - string
  "avator": "https://photo.zastatic.com/images/cms/banner/20181121/8311191311554389.png", // 头像
  "photos": [
            "https://photo.zastatic.com/images/photo/467571/1870282366/960647145683513.png", // 用户图片
            ....
        ],
  "nationality": "汉族", // 名族
  "constellation": "魔羯座(12.22-01.19)", //星座
  "isRealAvator": 是 //是否是真人头像
  "likes": ["1"], // 我喜欢的人的列表
  "objectInfo": { // 配偶标准要求
            "salary": "月薪:2万-5万", // 收入
            "height": "178cm以上", // 身高
            "age": "23-37岁", // 年龄
        }
}
   }

  @apiErrorExample Error-Response:
      HTTP/1.1 200 
  {
  code:500,
  msg:""
  }  
 */
  @Get('getUserInfo')
  async getUserInfo(@Req() req: any): Promise<IUserDetail> {
    return await this.userService.getUserInfo(req.user.openid)
  }

  /**
  @apiGroup User
  @apiVersion 0.1.0
  @api {put} http://localhost:8009/users/like/:openid  关注(收藏)接口
 
  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 
    {"code":200,"message":"success"}

  @apiErrorExample Error-Response:
      HTTP/1.1 200 
  {
  code:500,
  msg:""
  }  
 */
  @Get('like/:openid')
  async like(@Param() params, @Req() req: any): Promise<any> {
    return await this.userService.like(req.user.openid, params.openid)
  }

  /**
  @apiGroup User
  @apiVersion 0.1.0
  @api {get} http://localhost:8009/users/like/count  获取喜欢的类别和数量
 
  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 
   {
    "data": [
        {
            "type": "meLike", // 我喜欢
            "count": 2 // 数量
        },
        {
            "type": "likeMe", // 喜欢我
            "count": 0 // 数量
        },
        {
            "type": "likeEachOther", //相互喜欢
            "count": 1 // 数量
        }
    ],
    "code": 200,
    "message": "success"
}

  @apiErrorExample Error-Response:
      HTTP/1.1 200 
  {
  code:500,
  msg:""
  }  
 */
  @Get('/like/count')
  async countLike(@Req() req: any): Promise<any> {
    return await this.userService.countLike(req.user.openid)
  }

  /**
@apiGroup User
@apiVersion 0.1.0
@api {post} http://localhost:8009/users/listLikes  获取对应喜欢类别的用户列表
@apiParamExample {json} Request-Example:
{
"type": "meLike"
}

@apiSuccessExample Success-Response:
  HTTP/1.1 200 OK 
 {
  "data": [
      {
          "objectInfo": {
              "salary": "月薪:2万-5万",
              "height": "178cm以上",
              "age": "23-37岁"
          },
          "photos": [
              "https://photo.zastatic.com/images/photo/467571/1870282366/960647145683513.png",
              "https://photo.zastatic.com/images/photo/467571/1870282366/963471443961834.png",
              "https://photo.zastatic.com/images/photo/467571/1870282366/963471443960586.png",
              "https://photo.zastatic.com/images/photo/467571/1870282366/963471443964435.png",
              "https://photo.zastatic.com/images/photo/467571/1870282366/963471443963108.png",
              "https://photo.zastatic.com/images/photo/467571/1870282366/963471443966899.png"
          ],
          "likes": [
              "1"
          ],
          "_id": "5d74d60cc2de8bfb0bae9fdb",
          "openid": "1870282366",
          "avator": "https://photo.zastatic.com/images/cms/banner/20181121/8311191311554389.png",
          "birth": "1995-2-4",
          "constellation": "魔羯座(12.22-01.19)",
          "createdAt": "2019-09-08T10:20:59.856Z",
          "education": "本科",
          "gender": 1,
          "height": 160,
          "name": "慕烟",
          "nationality": "汉族",
          "updatedAt": "2019-09-08T12:01:54.444Z",
          "isRealAvator": true,
          "phone": "176021394",
          "age": 27,
          "hasChild": false,
          "haveHouse": true,
          "isMarriage": false,
          "jobDetail": "银行",
          "jobGeneral": "金融",
          "salary": "8001-12000",
          "wantChild": true,
          "workCity": "上海",
          "workProvince": "上海",
          "workRegion": "黄浦区"
      }
  ],
  "code": 200,
  "message": "success"
}

@apiErrorExample Error-Response:
    HTTP/1.1 200 
{
code:500,
msg:""
}  
*/
  @Post('listLikes')
  async listLikes(@Body() body, @Req() req: any): Promise<IUserDetail[]> {
    return await this.userService.listLikes(body.type, req.user.openid)
  }
}
