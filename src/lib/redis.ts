import { now } from 'moment'
import { User } from '../models/user'
import { SecureService } from './secure.service'
import { promisify } from 'util'
import { async } from 'rxjs/internal/scheduler/async'

const redis = require('redis')
export const redisClient = redis.createClient()

export const getPromisefy = () => {
  return promisify(redisClient.get).bind(redisClient)
}

export const setPromisefy = () => {
  return promisify(redisClient.set).bind(redisClient)
}

export const setValue = async (key: string, value: any) => {
  let result: any
  if (typeof value === 'object') {
    result = await setPromisefy()(key, JSON.stringify(value))
  }
  result = await setPromisefy()(key, JSON.stringify(value))
  console.log(result)
}

export const getValue = async (key: string, needParse = false) => {
  const value = await getPromisefy()(key)
  if (needParse) {
    return JSON.parse(value)
  }
  console.log('redis key', key, 'redis value', value)
  return value
}

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
    // message = JSON.parse(message);
    // const messageSchema = new Message(message);
    // await messageSchema.save();
    // //把最后一条消息更新到group上面
    // const user = await User.findOne({ openid: message.from });
    // message.fromName = user.nickName;
    // message.fromAvatarUrl = user.avatarUrl;
    // console.log({ lastMessage: message, updatedAt: now() });
    // await Group.updateOne(
    //   { _id: message.cid },
    //   { $set: { lastMessage: message, updatedAt: now() } },
    // );
  } catch (error) {
    console.error('saveMessageError', error)
  }
}
