import { Injectable } from '@nestjs/common'

let heightRules = [
  {
    key: [-100, 0],
    value: 60,
  },
  {
    key: [0, 5],
    value: 70,
  },
  {
    key: [5, 10],
    value: 80,
  },
  {
    key: [10, 15],
    value: 90,
  },
  {
    key: [15, 20],
    value: 95,
  },
  {
    key: [20, 100],
    value: 95,
  },
]

let ageRules = [
  {
    key: [-100, 0],
    value: 60,
  },
  {
    key: [0, 5],
    value: 80,
  },
  {
    key: [5, 10],
    value: 90,
  },
  {
    key: [10, 15],
    value: 80,
  },
  {
    key: [15, 20],
    value: 70,
  },
  {
    key: [20, 100],
    value: 60,
  },
]

let salaryMap = [
  {
    key: '5千以下',
    value: 1,
  },
  {
    key: '5千～1万',
    value: 2,
  },
  {
    key: '1万～2万',
    value: 3,
  },
  {
    key: '2万～5万',
    value: 4,
  },
  {
    key: '5万以上',
    value: 5,
  },
]

let salaryRules = [
  {
    key: [-10, 0],
    value: 60,
  },
  {
    key: [0, 1],
    value: 70,
  },
  {
    key: [1, 2],
    value: 80,
  },
  {
    key: [2, 3],
    value: 90,
  },
  {
    key: [3, 10],
    value: 80,
  },
]

@Injectable()
export class RulesService {
  static generateHeightScore(male: number, female: number): number {
    const difference = male - female
    return RulesService.generateScore(heightRules, difference)
  }
  static generateAgeScore(male: number, female: number): number {
    const difference = male - female
    return RulesService.generateScore(ageRules, difference)
  }
  static generateSalaryScore(male, female): number {
    const difference =
      RulesService.getSalaryLevel(male) - RulesService.getSalaryLevel(female)
    return RulesService.generateScore(salaryRules, difference)
  }
  static getSalaryLevel(key): number {
    let value = 1
    salaryMap.forEach(salary => {
      if (salary.key === key) {
        value = salary.value
      }
    })
    return value
  }
  static generateScore(roles, difference: number): number {
    let number = 60
    roles.forEach(rule => {
      if (rule.key[1] > difference && rule.key[0] <= difference)
        number = rule.value
    })
    return number
  }
}
