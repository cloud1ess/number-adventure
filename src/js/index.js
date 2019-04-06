import { registerHook, getNextState, switchToNextState } from './state.js'
import { drawHook } from './draw/draw.js'
import { logic } from './logic.js'

registerHook(drawHook)

logic(getNextState, switchToNextState)