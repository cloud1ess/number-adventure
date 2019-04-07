import { registerStateCallback, getState, setState } from './state.js'
import { registerInteractionCallback, setInteractiveHook } from './interaction.js'
import { registerStateHooks, runLogicHook, ACTIONS } from './logic/logic.js'
import { registerInteractionHooks, drawHook } from './draw/draw.js'

registerStateCallback(drawHook) // Draw when state changes
registerInteractionCallback(runLogicHook) // Run Logic after an interaction
registerStateHooks(getState, setState) // Allow Logic to get and set state
registerInteractionHooks(setInteractiveHook) // Allow Draw to create interactive UI element

runLogicHook(ACTIONS.INIT)