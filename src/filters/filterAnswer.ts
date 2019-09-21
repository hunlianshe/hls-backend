interface inputAnswer {
  question: string
  answer: string
}
interface IGenerateAnswerInput {
  id: string
  inputAnswer: inputAnswer[]
}

const answer = [
  {
    id: '5d7e0c2fe07dad0a832248f7',
    answers: {
      '你喜欢看哪种类型的电影？': {
        A: ['拉布拉多', '美短'],
        B: ['波斯', '美短'],
        C: ['波斯', '牧羊'],
        D: ['牧羊', '拉布拉多'],
      },
      '你觉得你的强项和优点是什么？': {
        A: ['拉布拉多', '牧羊'],
        B: ['波斯', '美短'],
        C: ['波斯', '牧羊'],
        D: ['拉布拉多', '美短'],
      },
      '你今天过得很糟糕，你准备睡觉之前如果让自己放松一下缓解压力？': {
        A: ['拉布拉多', '牧羊'],
        B: ['波斯', '美短'],
        C: ['波斯', '牧羊'],
        D: ['美短', '拉布拉多'],
      },
      '如果可以给自己换一个名字，你想换成什么样的名字？': {
        A: ['波斯', '牧羊'],
        B: ['波斯', '美短'],
        C: ['牧羊', '拉布拉多'],
        D: ['美短', '拉布拉多'],
      },
      '在社交场合，比如在一场派对中，你是什么样的？': {
        A: ['牧羊'],
        B: ['波斯'],
        C: ['美短'],
        D: ['拉布拉多'],
      },
      '人固有一死，你希望最终你以什么样的方式死去？': {
        A: ['波斯'],
        B: ['牧羊'],
        C: ['拉布拉多'],
        D: ['美短'],
      },
    },
  },
]

const analyzeReport = {
  美短: {
    title: '美国短毛猫',
    imageUrl:
      'http://zukuan.oss-cn-shanghai.aliyuncs.com/tim/%E7%BE%8E%E7%9F%AD.jpg',
    feature:
      '你是活泼好动的美国短毛猫，有丰富的想象力，对世界充满了好奇，甜美又调皮，有时也会任性，人见人爱，让生活多姿多彩',
  },
  波斯: {
    title: '波斯猫',
    imageUrl:
      'http://zukuan.oss-cn-shanghai.aliyuncs.com/tim/%E6%B3%A2%E6%96%AF%E7%8C%AB.jpg',
    feature:
      '你是若即若离的波斯猫，自信，高贵，特立独行，有时冷漠，给人高高在上的感觉。对事物有独特的审美，对生活高标准高要求，对爱情也是如此',
  },
  牧羊: {
    title: '德国牧羊犬',
    imageUrl:
      'http://zukuan.oss-cn-shanghai.aliyuncs.com/tim/%E7%89%A7%E7%BE%8A%E7%8A%AC.jpg',
    feature:
      '你是独立且忠诚的牧羊犬，表面高冷，面无表情，心里只有工作，实际上内心炙热，待人忠厚，对待感情更是非常认真和投入，不计较付出',
  },
  拉布拉多: {
    title: '拉布拉多',
    imageUrl:
      'http://zukuan.oss-cn-shanghai.aliyuncs.com/tim/%E6%8B%89%E5%B8%83%E6%8B%89%E5%A4%9A.jpg',
    feature:
      '你是温顺的拉布拉多，非常暖心，对伴侣几乎言听计从，脾气很好，朋友很多，还很会照顾人，格外顾家',
  },
}

const filterCatOrDog = (input: IGenerateAnswerInput): string[] => {
  const correspondAnswer = answer.filter(elem => (elem.id = input.id))
  if (correspondAnswer.length === 0) {
    throw new Error('no question')
  }
  const result = []
  const elem = correspondAnswer[0].answers
  input.inputAnswer.forEach((inputElem: inputAnswer) => {
    result.push(...elem[inputElem.question][inputElem.answer])
  })
  return result
}

export { filterCatOrDog, analyzeReport }
