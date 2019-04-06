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

const isMovable = (state, {r, c}) => {
  return ![
    ...state.interestingThings,
    ...state.chars
  ].some((thing) => thing.pos.r === r && thing.pos.c === c)
} 

const isNearSomethingInteresting = (pos, state) => {
  return state.interestingThings.find((thing) => Math.abs(thing.pos.r-pos.r) <=1 && Math.abs(thing.pos.c-pos.c) <=1)
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
      interestingThings: [
        {
          pos: {
            c: 15,
            r: 5
          },
          challenge: {
            actionCost: 2,
            question: "What is 3 * 5?",
            choices: [12,14,15,20],
            answer: 15,
            reward: [3,2,1]
          }
        }, {
          pos: {
            c: 2,
            r: 2
          },
          purchase: [
  
          ]
        }

      ],
      chars: [{
        pos: {
          c: 10,
          r: 10
        },
        actions: 10,
        maxActions: 10,
        stars: 0,
        maxStars: 6,
        bonuses: []
      },{
        pos: {
          c: 10,
          r: 10
        },
        actions: 0,
        maxActions: 10,
        stars: 0,
        maxStars: 6,
        bonuses: []
      }]
    }
  }
  if (state.view === VIEWS.GAME) {
    const currentChar = state.chars[state.currentChar]
    
    if (actionId === ACTIONS.UP && currentChar.actions > 0 && isMovable(state, {r: currentChar.pos.r-1, c: currentChar.pos.c})) {
      currentChar.pos.r --
      currentChar.actions --
    } else if (actionId === ACTIONS.LEFT && currentChar.actions > 0 && isMovable(state, {r: currentChar.pos.r, c: currentChar.pos.c-1})) {
      currentChar.pos.c --
      currentChar.actions --
    } else if (actionId === ACTIONS.DOWN && currentChar.actions > 0 && isMovable(state, {r: currentChar.pos.r+1, c: currentChar.pos.c})) {
      currentChar.pos.r ++
      currentChar.actions --
    } else if (actionId === ACTIONS.RIGHT && currentChar.actions > 0 && isMovable(state, {r: currentChar.pos.r, c: currentChar.pos.c+1})) {
      currentChar.pos.c ++
      currentChar.actions --
    } else if (actionId === ACTIONS.ENDGO) {
      state.currentChar ++
      if (state.currentChar >= state.chars.length) {
        state.currentChar = 0
      }
      state.chars[state.currentChar].actions = state.chars[state.currentChar].maxActions
    }
    currentChar.near = isNearSomethingInteresting(currentChar.pos, state)
  }

  setState(state)
}