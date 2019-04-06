let getState = () => {}
let setState = () => {}

export const VIEWS = {
  SETUP: 'setup',
  GAME: 'game'
}

export const ACTIONS = {
  INIT: 'init'
}

export const registerStateHooks = (getStateHook, setStateHook) => {
  getState = getStateHook
  setState = setStateHook
}

export const runLogicHook = (actionId, event, state = getState()) => {
  state.view = VIEWS.SETUP
  console.log(actionId)
  setState(state)
}