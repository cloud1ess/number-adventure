import Utils from '../../libs/Utils.js'

let state = {}
const callbacks = []

const registerStateCallback = (callback) => {
  callbacks.push(callback)
}

const getState = () => {
 return Utils.copy(state)
}

const setState = (nextState) => {
  state = nextState
  callbacks.forEach(hook => hook(Utils.copy(state)))
}

export {
  registerStateCallback,
  getState,
  setState
}