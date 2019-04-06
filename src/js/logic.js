let getState = () => { }
let setState = () => { }

export const VIEWS = {
  SETUP: 'setup',
  GAME: 'game'
}

export const ACTIONS = {
  INIT: 'init',
  UP: 'up',
  LEFT: 'left',
  DOWN: 'down',
  RIGHT: 'right',
  ENDGO: 'endgo'

}

export const registerStateHooks = (getStateHook, setStateHook) => {
  getState = getStateHook
  setState = setStateHook
}

export const runLogicHook = (actionId, event, state = getState()) => {
  
  if (actionId === ACTIONS.INIT) {
    state = {
      view: VIEWS.GAME,
      currentChar: 0,
      map: {
        width: 20,
        height: 20
      },
      chars: [{
        pos: {
          c: 10,
          r: 10
        },
        moves: 10,
        maxMoves: 10,
        bonuses: []
      },{
        pos: {
          c: 10,
          r: 10
        },
        moves: 10,
        maxMoves: 10,
        bonuses: []
      }]
    }
  }
  const currentChar = state.chars[state.currentChar]
  
  if (actionId === ACTIONS.UP && currentChar.moves > 0) {
    currentChar.pos.r --
    currentChar.moves --
  } else if (actionId === ACTIONS.LEFT && currentChar.moves > 0) {
    currentChar.pos.c --
    currentChar.moves --
  } else if (actionId === ACTIONS.DOWN && currentChar.moves > 0) {
    currentChar.pos.r ++
    currentChar.moves --
  } else if (actionId === ACTIONS.RIGHT && currentChar.moves > 0) {
    currentChar.pos.c ++
    currentChar.moves --
  } else if (actionId === ACTIONS.ENDGO) {
    state.currentChar ++
    if (state.currentChar >= state.chars.length) {
      state.currentChar = 0
    }
    state.chars[state.currentChar].moves = state.chars[state.currentChar].maxMoves
  }
  console.log(actionId)

  setState(state)
}