export const VIEWS = {
  START: 'start'
}
export default (getNextState, switchToNextState) => {
  const nextState = getNextState()

  nextState.view = VIEWS.START

  switchToNextState()
}