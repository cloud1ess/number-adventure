let getState = () => { }
let setState = () => { }

export const VIEWS = {
  SETUP: 'setup',
  GAME: 'game'
}

export const ACTIONS = {
  INIT: 0,
  UP: 1,
  LEFT: 2,
  DOWN: 3,
  RIGHT: 4,
  ENDGO: 5,
  ACCEPT_CHALLENGE: 6
}

const isMovable = (state, {r, c}) => {
  return ![
    ...state.interestingThings,
    ...state.chars
  ].some((thing) => thing.pos.r === r && thing.pos.c === c)
} 

const isNearSomethingInteresting = (state) => {
  const charPos = state.chars[state.currentChar].pos
  const nearThingIndex = state.interestingThings.findIndex((thing) => Math.abs(thing.pos.r-charPos.r) <=1 && Math.abs(thing.pos.c-charPos.c) <=1)

  return (nearThingIndex >= 0) ? { charIndex: state.currentChar, interestingThingIndex: nearThingIndex } : null
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
            paidFor: false,
            cost: 2,
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
        name: 'Tom',
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
        name: 'Laura',
        actions: 0,
        maxActions: 10,
        stars: 0,
        maxStars: 6,
        bonuses: []
      }]
    }
  }
  if (state.view === VIEWS.GAME) {
    let currentChar = state.chars[state.currentChar]
    
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
    } else if (actionId === ACTIONS.ACCEPT_CHALLENGE) {
      let challenge = state.interestingThings[state.speech.interestingThingIndex]
      challenge = challenge.challenge || {}

      if (challenge.cost && currentChar.actions >= challenge.cost) {
        currentChar.actions -= challenge.cost
        challenge.paidFor = true
      }
    } else if (actionId === ACTIONS.ENDGO) {
      state.currentChar ++
      if (state.currentChar >= state.chars.length) {
        state.currentChar = 0
      }
      state.chars[state.currentChar].actions = state.chars[state.currentChar].maxActions
    }
    state.speech = isNearSomethingInteresting(state)
  }

  setState(state)
}