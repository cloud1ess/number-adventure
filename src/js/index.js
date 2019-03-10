import { registerHook, getNextState, switchToNextState } from './state.js'
import { drawHook } from './draw.js'
import Logic from './logic.js'

registerHook(drawHook)

Logic(getNextState, switchToNextState)