import { now } from 'moment'
import { Group } from '../models/group'
import { Message } from '../models/message'

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
    await Group.updateOne({ _id: message.cid }, { $set: { updatedAt: now() } })
  } catch (error) {
    console.error('saveMessageError', error)
  }
}
