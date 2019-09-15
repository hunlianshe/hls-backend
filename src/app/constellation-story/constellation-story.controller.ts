import { Controller, Get, Param } from '@nestjs/common'
import { ConstellationStoryService } from './constellation-story.service'
import { IConstellationStory } from '../../models/constellationStory'

@Controller('constellation-story')
export class ConstellationStoryController {
  constructor(
    private readonly constellationStoryService: ConstellationStoryService,
  ) {}

  /**
  @apiGroup constellation-story
  @apiVersion 0.1.0
  @api {get} http://localhost:8009/constellation-story/listStory/白羊座 获取星座故事

  @apiSuccessExample Success-Response:
    HTTP/1.1 200 OK 

  {
     "data":{
        "_id":"5d7de9d0e07dad0a832248df",
        "storyTitle":"助佛里克索斯逃生的金毛飞羊", // 故事标题
        // 图片链接
        "imageUrl":"https://p.d1xz.net/2015/4/8/141579907990.jpg?x-oss-process=image%2Fformat%2Cjpg%2Fquality%2Cq_80%2Finterlace%2C1", 
        // 故事内容
        "storyContent":"　　古希腊有个国王名叫阿塔玛斯，他娶了云间仙女涅斐勒（Nephele）为妻，婚后他们生了一男一女，男孩名叫佛里克索斯（Phrixus），女孩名叫赫勒（Helle），生活过得很幸福。后来国王阿塔玛斯宠爱了一个名叫伊诺（Ino）的女人，阿塔玛斯抛弃了涅斐勒，与伊诺结了婚，被抛弃的涅斐勒便黯然地离开她的两个孩子和国王，返回云间。<br></br><br></br>　　伊诺受到国王的宠爱，但她一直视赫勒和佛里克索斯两姐弟为眼中钉，经常虐待他们，涅斐勒在云间看到自己的孩子受到后母的虐待，十分气愤，便请示宙斯（Zeus）降灾祸给这个国家。谁知伊诺欲置佛里克索斯于死地，竟乘机向国王说什麽只有将王子活祭给神，才能免除灾难。幸好这个阴谋被神使哈姆斯（Hermes）发现，哈姆斯就送给涅斐勒一隻浑身长满金毛、长有翅膀的飞羊，让涅斐勒叫她两个孩子骑乘飞羊逃往远方。<br></br><br></br>　　赫勒和佛里克索斯便骑着这隻神异的金毛羊，飞渡了许多陆地和汪洋，但赫勒在飞渡一片大海时，往下只看见一片汪洋，只感头晕目眩，支持不来，竟坠海而亡。佛里克索斯救援不及，只好悲伤而去，从此那片大海就以赫勒为名，叫做赫勒海。佛里克索斯成功跨越大海，到达黑海东岸的科尔喀斯，更受到国王埃厄特斯（Aeetes）的热情款待，成为埃厄特斯的女婿。<br></br><br></br>　　佛里克索斯感谢天神庇佑之恩，便将金毛飞羊献祭给宙斯，宙斯为了嘉奖这隻救助佛里克索斯逃生的金毛飞羊，便把它高高地放在天上众星之间，成为了白羊座。<br></br><br></br>",
        // 星座
        "constellation":"白羊座",
        "updatedAt":"2019-09-15T08:02:00.959Z"
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
  @Get('/listStory/:constellation')
  async listStory(@Param() params): Promise<IConstellationStory> {
    return await this.constellationStoryService.listStory(params.constellation)
  }
}
