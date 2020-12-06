import { Injectable } from '@nestjs/common'
import * as config from 'config'
const oss = require('@alicloud/oss-util')
const fs = require('fs')
const request = require('request')
const mkdirp = require('mkdirp')

const imagesearch = require('@alicloud/imagesearch')
const conf = new imagesearch.Config({
  accessKeyId: config.ALIDY.AccessKey,
  accessKeySecret: config.ALIDY.AccessSecret,
  endpoint: config.ALIDY.endpoint,
  type: 'access_key',
  regionId: 'cn-shanghai',
  protocol: 'http',
})

@Injectable()
export class ImagesService {
  async searchPicture(url: string): Promise<any> {
    const client = new imagesearch.default(conf)
    var picContent = fs.createReadStream(
      await this.downloadImage(url, 'public/teamplate'),
    )
    const searchImageByPicAdvanceRequest = new imagesearch.SearchImageByPicAdvanceRequest(
      {
        // 必填，图像搜索实例名称。
        instanceName: config.ALIDY.instanceName,
        // 图片内容，最多支持 2MB大小图片以及5s的传输等待时间。当前仅支持jpg和png格式图片；
        // 对于商品、商标、通用图片搜索，图片长和宽的像素必须都大于等于200，并且小于等于1024；
        // 对于布料搜索，图片长和宽的像素必须都大于等于448，并且小于等于1024；
        // 图像中不能带有旋转信息
        picContentObject: picContent,
      },
    )
    let ossRuntime = new oss.RuntimeOptions({})
    const searchImageByPicResponse = await client.searchImageByPicAdvance(
      searchImageByPicAdvanceRequest,
      ossRuntime,
    )
    return searchImageByPicResponse
  }

  async downloadImage(url, dir) {
    mkdirp.sync(dir)
    let params = url.split('/')
    let name = params[params.length - 1]
    return await new Promise(function(resolve, reject) {
      request(url)
        .pipe(fs.createWriteStream(`${dir}/${name}`))
        .on('close', (err, result) => {
          if (err) throw err
          resolve()
        })
    })
  }
}
