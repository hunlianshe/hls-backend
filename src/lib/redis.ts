import { now } from 'moment'
import { User } from '../models/user'
import { Group } from '../models/group'
import { Message } from '../models/message'
import { SecureService } from './secure.service'

const redis = require('redis')

export const connectRedis: any = () => {
  const client = redis.createClient()
  client.on('error', function(error) {
    console.error(error)
  })
  client.on('connect', () => {
    console.log('Redis is connect')
  })
  client.subscribe('message')
  client.on('message', function(channel, message) {
    console.log(typeof message)
    consumberMessage(message)
    console.log('message channel:' + channel + ', msg:' + message)
  })
}

const consumberMessage = async message => {
  try {
    message = JSON.parse(message)
    const messageSchema = new Message(message)
    await messageSchema.save()

    //把最后一条消息更新到group上面
    const user = await User.findOne({ openid: message.from })
    message.fromName = user.nickName
    message.fromAvatarUrl = user.avatarUrl
    console.log({ lastMessage: message, updatedAt: now() })

    await Group.updateOne(
      { _id: message.cid },
      { $set: { lastMessage: message, updatedAt: now() } },
    )
  } catch (error) {
    console.error('saveMessageError', error)
  }
}
