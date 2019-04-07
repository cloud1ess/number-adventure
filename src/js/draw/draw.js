import Utils from '../../../libs/Utils.js'
import Panel from '../../../libs/Panel.js'
import { VIEWS } from '../logic.js'
import DrawSetup from './draw_setup.js'
import {init as initGame, draw as drawGame} from './draw_game.js'

let setInteractive = () => {}

const canvasSize = {
  width: 600,
  height: 600
}

const game = Utils.createElement('div', null, ['game_container'])
const canvas = Utils.createElement('canvas', game, [], canvasSize)
let panel = Panel(canvas);

const drawView = {
  [VIEWS.GAME]: drawGame
}

const initView = {
  [VIEWS.GAME]: initGame
}

const initDrawView = (state) => {
  initView[state.view](state, panel, setInteractive)
  renderedView = state.view
}

let renderedView

export const registerInteractionHooks = (setInteractiveHook) => {
  setInteractive = setInteractiveHook
}

export const drawHook = (state) => {
  if (drawView[state.view]) {
    if (renderedView !== state.view) {
      initDrawView(state)
    }
    panel.clear()
    drawView[state.view](state, setInteractive)
    panel.render()
  } else {
    console.log(`No Draw function for view: ${state.view}`)
  }
}