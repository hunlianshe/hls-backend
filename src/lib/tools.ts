import * as moment from 'moment'

function getcharsetRandom() {
  let random = ''
  let i = 0
  while (i < 6) {
    random += Math.floor(Math.random() * 10)
    i++
  }
  return random
}

export const generateOrderNum = (): string => {
  let orderNum = `ax-${moment().format('YYYYYMMDD')}${getcharsetRandom()}`
  return orderNum
}

export const dealWithPrice = (origin: string) => {
  return origin.replace(/([0-9]+.[0-9]{2})[0-9]*/, '$1')
}
