import Utils from '../../../libs/Utils.js'

const genQuestAnswers = (answer, numOfOptions) => {
  let otherOptions = []
  const totalWrongAnswers = numOfOptions+4
  for (let i=-Math.floor(totalWrongAnswers/2); i<totalWrongAnswers/2; i++) {
    if (i !== 0) {
      otherOptions.push(answer + i)
    }
  }

  otherOptions = Utils.randomise(otherOptions).splice(0, numOfOptions)
  otherOptions.push(answer)

  return Utils.randomise(otherOptions)
}

export default {
  1: [
    () => {
      const a = Math.floor(Math.random()+5)+5
      const b = Math.floor(Math.random()+5)
      const answer = a + b
      const options = genQuestAnswers(answer, 3)

      return {
        question: `What is ${a} + ${b}?`,
        answer,
        options,
        cost: 1,
        reward: 1
      }
    },
    () => {
      const a = Math.floor(Math.random()+5)+5
      const b = Math.floor(Math.random()+5)
      const answer = a - b
      const options = genQuestAnswers(answer, 3)

      return {
        question: `What is ${a} - ${b}?`,
        answer,
        options,
        cost: 1,
        reward: 1
      }
    },
    () => {
      const a = Math.floor(Math.random()+5)
      const b = 2
      const answer = a * b
      const options = genQuestAnswers(answer, 3)
      return {
        question: `What is ${a} * ${b}?`,
        answer: a * b,
        options,
        cost: 2,
        reward: 1
      }
    }     
  ],
  2: [
    () => {
      const a = Math.floor(Math.random()+5)
      const b = 2
      const answer = a * b
      const options = genQuestAnswers(answer, 3)
      return {
        question: `What is ${a} * ${b}?`,
        answer: a * b,
        options,
        cost: 2,
        reward: 1
      }
    }    
  ],
  3: [    
    () => {
      const a = Math.floor(Math.random()+5)+5
      const b = 2
      return {
        question: `What is ${a} * ${b}?`,
        answer: a * b,
        cost: 3,
        reward: 1
      }      
    }
  ]
}