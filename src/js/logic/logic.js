import initGame from './initGame'

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
  ACCEPT_QUEST: 6
}

const isMovable = (state, {r, c}) => {
  return ![
    ...state.npcs,
    ...state.chars
  ].some((thing) => thing.pos.r === r && thing.pos.c === c)
} 

const isNearNPC = (state) => {
  const charPos = state.chars[state.currentChar].pos
  const nearThingIndex = state.npcs.findIndex((npc) => (Math.abs(npc.pos.r-charPos.r) <= 1) && (Math.abs(npc.pos.c-charPos.c) <= 1))

  return (nearThingIndex >= 0) ? { charIndex: state.currentChar, npcIndex: nearThingIndex } : null
} 

const moveCameraToPos = (camera, pos) => {
  camera.pos.c = pos.c
  camera.pos.r = pos.r
}

export const registerStateHooks = (getStateHook, setStateHook) => {
  getState = getStateHook
  setState = setStateHook
}

export const runLogicHook = (actionId, event, state = getState()) => {  
  if (actionId === ACTIONS.INIT) {
    state = initGame(state.chars)
    state.currentChar = -1
    actionId = ACTIONS.ENDGO
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
    } else if (actionId === ACTIONS.ACCEPT_QUEST) {
      let quest = state.npcs[state.speech.npcIndex]
      quest = quest.quest || {}

      if (quest.cost && currentChar.actions >= quest.cost) {
        currentChar.actions -= quest.cost
        quest.paidFor = true
      }
    } else if (actionId === ACTIONS.ENDGO) {
      state.currentChar ++
      if (state.currentChar >= state.chars.length) {
        state.currentChar = 0
      }
      state.chars[state.currentChar].actions = state.chars[state.currentChar].maxActions
    }

    moveCameraToPos(state.camera, state.chars[state.currentChar].pos)
    state.speech = isNearNPC(state)
  }

  setState(state)
}