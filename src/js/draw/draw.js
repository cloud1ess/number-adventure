import Utils from '../../../libs/Utils.js'
import Panel from '../../../libs/Panel.js'
import {VIEWS} from '../logic.js'
import DrawSetup from './draw_setup.js'
import DrawGame from './draw_game.js'

const canvasSize = {
  width: 600,
  height: 600
}

const game = Utils.createElement('div', null, ['game_container'])
const canvas = Utils.createElement('canvas', game, [], canvasSize)
const panel = Panel(canvas);

const drawView = {
  [VIEWS.SETUP]: DrawSetup,
  [VIEWS.GAME]: DrawGame
}

const clearCanvas = (clearPanels) => {
  if (clearPanels) panel.clear()
  panel.drawRect({
    x: 0,
    y: 0,
    wid: canvasSize.width,
    hei: canvasSize.height,
    colour: 'rgb(51, 178, 77)'
  });  
}

let renderedView

export const drawHook = (state) => {
  if (drawView[state.view]) {
    clearCanvas(renderedView === state.view)
    drawView[state.view](state, panel)
    panel.render()
    renderedView = state.view
  } else {
    console.log(`No Draw function for view: ${state.view}`)
  }
}