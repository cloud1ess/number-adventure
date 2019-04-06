import Utils from '../../libs/Utils.js'

let currentState = {}
let nextState = {}
const registeredhooks = []

const registerHook = (callback) => {
  registeredhooks.push(callback)
}

const getCurrentState = () => {
 return Utils.copy(currentState)
}

const getNextState = () => {
  return nextState
}

const switchToNextState = () => {
  currentState = nextState
  //nextState = Utils.copy(currentState)
  registeredhooks.forEach(hook => hook(currentState))
}

export {
  registerHook,
  getCurrentState,
  getNextState,
  switchToNextState
}