import { Controller, Get, Param, Req, Request } from '@nestjs/common'
import { FortuneService } from './fortune.service'
import { IFortune } from '../../models/fortune'

@Controller('fortune')
export class FortuneController {
  constructor(private readonly fortuneService: FortuneService) {}

  @Get('updateDoc')
  async updateDoc(): Promise<void> {
    await this.fortuneService.updateDoc()
  }
  /**
  @apiGroup Fortune
  @apiVersion 0.1.0
  @api {get} /fortune/:fortuneName 获取运势详情

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

  {
     "data":{
        "_id":"5d7476e196d970539ed3d6e3",
        // 星座名称
        "name":"白羊座",
        // 生辰
        "birth":"3.21-4.20",
        //属性
        "attributes":"火相",
        // 特点
        "feature":"勇敢，火热，大方",
        // 描述
        "desc":"白羊座，内心有着一个被放大的自我，这个自我里住着一个天真的孩子，孩子都会认为自己就是世界的中心，所以白羊座会有一点自私，但他们对朋友都不具心机，讲义气，想法和说话速度一样快的白羊座，有时也较少在意别人的感受。白羊座，内心有着一个被放大的自我，这个自我里住着一个天真的孩子，孩子都会认为自己就是世界的中心，所以白羊座会有一点自私，但他们对朋友都不具心机，讲义气，想法和说话速度一样快的白羊座，有时也较少在意别人的感受。",
        "updatedAt":"2019-09-08T03:44:37.004Z"
    },
    "code":200,
    "message":"success"
  }  

  @apiErrorExample Error-Response:
      HTTP/1.1 200 
    {
  code:500,
  msg:""
  }  
 */

  @Get('/:fortuneName')
  async getFortuneName(@Param() params): Promise<IFortune> {
    return await this.fortuneService.findByName(params.fortuneName)
  }

  /**
  @apiGroup Fortune
  @apiVersion 0.1.0
  @api {get} /fortune/horoscope/realtime?consName=白羊座&type=today  获取实时星座运势

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 
   
 {
    "data":{
        "name":"白羊座",
        "datetime":"2019年09月08日",
        "date":"2019-09-08",
        "all":"73%",
        "color":"白色",
        "health":"74%",
        "love":"72%",
        "money":"71%",
        "number":"3",
        "OFriend":"双鱼座",
        "summary":"白羊座今日运势一般，做事情的时候你可能没有赶上最开始的好时机，但是开弓没有回头箭，既然开始做了就要坚持下去。感情方面运势平平，你和另一半可能在沟通交流上有些互动变少，尽量注意一下为好。事业方面运势一般，工作中可能有交流不畅的情况，要多耐心解释为宜。另外工作时也要注意按时间节点完成工作不要拖拉。财运方面运势普通，投资理财方面好消息不多。健康方面运势平平，静养为宜。",
        "work":"73%"
    },
    "code":200,
    "message":"success"
}

  @apiErrorExample Error-Response:
      HTTP/1.1 200 
    {
  code:500,
  msg:""
  }  
 */

  @Get('/horoscope/realtime')
  async horoscope(@Req() request: Request): Promise<IFortune> {
    console.log('request', request.url)
    return await this.fortuneService.getHoroscope(
      request.url.replace(/\/.*\?/, ''),
    )
  }

  /**
  @apiGroup Fortune
  @apiVersion 0.1.0
  @api {get} /fortune/constellationMmatching/detail?me=金牛&he=白羊  简单星座匹配

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

 {
    "data": {
        "title": "金牛座：白羊座",
        "grade": "友情：★★爱情：★★★婚姻：★★亲情：★★",
        "content": "节奏不同是你们天生的问题，一个冲动，一个慢半拍，要把你们放在同一个世界一起生活，看来大家要非常容忍对方，如果不是，很难看到长远。白羊座的人喜欢用强烈的追求攻势去攻陷金牛座的人的心，但金牛座固执求稳的性格，必然会深思熟虑才肯接受追求，中间拉拉扯扯的时候，可能白羊座已经忍不住转身就走。如果真是可以走在一起，大家不妨用双打网球的原理，一个补、一个攻，也许能够创出光明的前途，大前提当然是已经能理解和接受对方的特性。假如金牛座一方是男性，白羊座的女性就要更主动、加大追求力度。白羊座的人还要学习金牛座深思熟虑的处事态度，明白这点，大家都有好处的。性生活方面，金牛喜欢耳鬓撕磨，白羊则速战速决，有时候要学会迁就对方了。"
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
  @Get('/constellationMmatching/detail')
  async constellationMmatching(@Req() request: Request): Promise<IFortune> {
    console.log('request', request.url)
    return await this.fortuneService.constellationMmatching(
      request.url.replace(/\/.*\?/, ''),
    )
  }
}
