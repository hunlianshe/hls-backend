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
