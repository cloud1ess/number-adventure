import initGame from './initGame.js'
import Quests from '../data/quests.js'
import Utils from '../../../libs/Utils.js'

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
  ACCEPT_QUEST: 6,
  ANSWER_QUESTION_CORRECT: 7,
  ANSWER_QUESTION_WRONG: 8
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
      let quest = state.npcs[state.speech.npcIndex].quest

      if (currentChar.actions >= 2) {
        currentChar.actions -= 2
        quest.current = Utils.chooseRandom(Quests[quest.difficulty])()
      }
    } else if (actionId === ACTIONS.ENDGO) {
      state.currentChar ++
      if (state.currentChar >= state.chars.length) {
        state.currentChar = 0
      }
      state.chars[state.currentChar].actions = state.chars[state.currentChar].maxActions
    } else if (actionId === ACTIONS.ANSWER_QUESTION_CORRECT) {
      let quest = state.npcs[state.speech.npcIndex].quest
      const char = state.chars[state.currentChar]
      char.stars += quest.reward
      delete state.npcs[state.speech.npcIndex].quest
    } else if (actionId === ACTIONS.ANSWER_QUESTION_WRONG) {
      let quest = state.npcs[state.speech.npcIndex].quest
      delete quest.current
    }

    moveCameraToPos(state.camera, state.chars[state.currentChar].pos)
    state.speech = isNearNPC(state)
  }

  setState(state)
}