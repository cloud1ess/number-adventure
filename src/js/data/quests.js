export default {
  1: [
    {
      generate: () => {
        a = Math.floor(Math.random()+5)+5
        b = Math.floor(Math.random()+5) 
        return {
          question: `What is ${a} + ${b}?`,
          answer: a + b
        }
      }
    }
  ],
  2: [
    {
      generate: () => {
        a = Math.floor(Math.random()+5)
        b = 2
        return {
          question: `What is ${a} * ${b}?`,
          answer: a * b
        }
      }
    }
  ],
  3: [
    {
      generate: () => {
        a = Math.floor(Math.random()+5)+5
        b = 2
        return {
          question: `What is ${a} * ${b}?`,
          answer: a * b
        }
      }
    }
  ]
}