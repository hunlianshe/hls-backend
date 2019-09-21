enum ILikeType {
  likeMe = 'likeMe',
  meLike = 'meLike',
  likeEachOther = 'likeEachOther',
}

interface IPastLove {
  gender?: number
  job?: string
  age?: number
  loveTimes?: number
  marryTimes?: number
  considerStandard?: number
  hsexualStandard?: number
  gentleStandard?: number
  hworkStandard?: number
  quarrelStandard?: number
  marryState?: string
}

export { ILikeType, IPastLove }
