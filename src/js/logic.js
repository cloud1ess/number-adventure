export const VIEWS = {
  SETUP: 'setup',
  GAME: 'game'
}
export const logic = (getNextState, switchToNextState) => {
  const nextState = getNextState()

  nextState.view = VIEWS.SETUP

  switchToNextState()

  setInterval(() => {
    const nextState = getNextState()

    nextState.ticks = nextState.ticks || 0
    nextState.ticks ++

    switchToNextState()
  }, 1000)
}