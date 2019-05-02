import Utils from '../../../libs/Utils.js'

export default {
  1: [
    {
      generate: () => {
        const a = Math.floor(Math.random()+5)+5
        const b = Math.floor(Math.random()+5)
        const answer = a + b
        const otherOptions = Utils.randomise([
          a + b-2,
          a + b-1,
          a + b+1,
          a + b+2,
          a + b+3,
        ])
        const options = Utils.randomise([
          answer,
          otherOptions[0],
          otherOptions[1],
          otherOptions[2]
        ])

        return {
          question: `What is ${a} + ${b}?`,
          answer,
          options,
          cost: 1,
          reward: 1,
          complete: false,
          paidFor: false
        }
      }
    }
  ],
  2: [
    {
      generate: () => {
        const a = Math.floor(Math.random()+5)
        const b = 2
        return {
          question: `What is ${a} * ${b}?`,
          answer: a * b,
          cost: 2,
          reward: 1,
          complete: false,
          paidFor: false
        }
      }
    }
  ],
  3: [
    {
      generate: () => {
        const a = Math.floor(Math.random()+5)+5
        const b = 2
        return {
          question: `What is ${a} * ${b}?`,
          answer: a * b,
          cost: 3,
          reward: 1,
          complete: false,
          paidFor: false
        }
      }
    }
  ]
}