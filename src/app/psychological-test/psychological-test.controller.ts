import { Controller, Get, Post, Param } from '@nestjs/common'
import { PsychologicalTestService } from './psychological-test.service'
import { IPsychologicalTest } from '../../models/psychologicalTest'

@Controller('psychological-test')
export class PsychologicalTestController {
  constructor(private readonly psyService: PsychologicalTestService) {}

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
}
