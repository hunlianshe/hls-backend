import { Controller, Get, Post, Param, Body, Req } from '@nestjs/common'
import { PsychologicalTestService } from './psychological-test.service'
import { IPsychologicalTest } from '../../models/psychologicalTest'
import { IPastLove } from 'src/types'

@Controller('psychological-test')
export class PsychologicalTestController {
  constructor(private readonly psyService: PsychologicalTestService) {}

  /**
  @apiGroup psychologicalTest
  @apiVersion 0.1.0
  @api {get} /psychological-test/getPastLove 获取前世情缘

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

{
    "data": {
        //性别
        "gender": 1,
        // 职业
        "job": "渔夫",
        // 寿命
        "age": 56,
        // 恋爱次数
        "loveTimes": 1,
        // 婚姻次数
        "marryTimes": 1,
        // 体贴指数
        "considerStandard": 7,
        // 异性指数
        "hsexualStandard": 3,
        // 温柔指数
        "gentleStandard": 8,
        // 家务指数
        "hworkStandard": 7,
        // 吵架指数
        "quarrelStandard": 2,
        // 婚恋情况
        "marryState": "古时婚配由父母之命媒妁之言，爱上亲梅竹马后父母提了亲，与妻子的日子过得和谐美满，膝下儿孙满堂"
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
  @Get('/getPastLove')
  async getPastLove(@Req() req: any): Promise<IPastLove> {
    return await this.psyService.getPastLove(req.user.gender)
  }

  /**
  @apiGroup psychologicalTest
  @apiVersion 0.1.0
  @api {get} /psychological-test/list 获取心理测试list

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

{
    "data":[
        {
            "_id":"5d74976396d970539ed3d6e4",
            //心理测试类型
             "type":"1",
            // 整套心理题目的标题
            "name":"你是怎样的情人",
            // 心理题目的内容
            "content":[
                {
                    // 答案选项
                    "answerOptions":[
                        {
                            "optionIndex":"A",
                            "optionContent":"聊骚甚至亲密举动"
                        },
                        {
                            "optionIndex":"B",
                            "optionContent":"在海滩边两个人手牵手看日落，喝着美酒享受海风"
                        },
                        {
                            "optionIndex":"C",
                            "optionContent":"只要和对方在一起做什么都行"
                        },
                        {
                            "optionIndex":"D",
                            "optionContent":"看电影和一起吃晚饭"
                        }
                    ],
                    // 问题
                    "question":"你想象中最好的第一次约会是什么样？"
                },
                ...
            ]
        }
    ]
}
  @apiErrorExample Error-Response:
      HTTP/1.1 200 
  {
  code:500,
  msg:""
  }  
 */

  @Get('list')
  async getPsyTest(): Promise<IPsychologicalTest[]> {
    return await this.psyService.findPsyTest()
  }

  /**
  @apiGroup psychologicalTest
  @apiVersion 0.1.0
  @api {get} /psychological-test/5d74976396d970539ed3d6e4 获取单个心理测试

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

{
    "data":
        {
            "_id":"5d74976396d970539ed3d6e4",
            // 整套心理题目的标题
            "name":"你是怎样的情人",
            "type":"1",
            // 心理题目的内容
            "content":[
                {
                    // 答案选项
                    "answerOptions":[
                        {
                            "optionIndex":"A",
                            "optionContent":"聊骚甚至亲密举动"
                        },
                        {
                            "optionIndex":"B",
                            "optionContent":"在海滩边两个人手牵手看日落，喝着美酒享受海风"
                        },
                        {
                            "optionIndex":"C",
                            "optionContent":"只要和对方在一起做什么都行"
                        },
                        {
                            "optionIndex":"D",
                            "optionContent":"看电影和一起吃晚饭"
                        }
                    ],
                    // 问题
                    "question":"你想象中最好的第一次约会是什么样？"
                }
            
        }
    ]
}
  @apiErrorExample Error-Response:
      HTTP/1.1 200 
  {
  code:500,
  msg:""
  }  
 */

  @Get(':id')
  async getPsyTestById(@Param() params): Promise<IPsychologicalTest> {
    return await this.psyService.findPsyTestById(params.id)
  }

  /**
  @apiGroup psychologicalTest
  @apiVersion 0.1.0
  @api {post} /psychological-test/generateCatOrDogResult 获取猫狗匹配
 @apiParamExample {json} Request-Example:
{
	"id": "5d7e0c2fe07dad0a832248f7", // 题目的id
	"inputAnswer": [{ // 用户的答案
		"question": "你喜欢看哪种类型的电影？", //题目
		"answer": "A" // 用户的选择
	},
	{
		"question": "你觉得你的强项和优点是什么？",
		"answer": "A"
	},
	{
		"question": "你今天过得很糟糕，你准备睡觉之前如果让自己放松一下缓解压力？",
		"answer": "A"
	},
	{
		"question": "如果可以给自己换一个名字，你想换成什么样的名字？",
		"answer": "A"
	},
	{
		"question": "在社交场合，比如在一场派对中，你是什么样的？",
		"answer": "A"
	},
	{
		"question": "人固有一死，你希望最终你以什么样的方式死去？",
		"answer": "A"
	}
	]
}

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

{
    "data": [
        {
            "title": "德国牧羊犬", // 具体品种
            //图片链接
            "imageUrl": "http://zukuan.oss-cn-shanghai.aliyuncs.com/tim/%E6%B3%A2%E6%96%AF%E7%8C%AB.jpg",
            // 特征
            "feature": "你是独立且忠诚的牧羊犬，表面高冷，面无表情，心里只有工作，实际上内心炙热，待人忠厚，对待感情更是非常认真和投入，不计较付出" 
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
  @Post('/generateCatOrDogResult')
  async generateCatOrDogResult(@Body() Body): Promise<any> {
    return await this.psyService.generateCatOrDogResult(Body)
  }
}
