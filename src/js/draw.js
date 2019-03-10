import Utils from '../../libs/Utils.js'
import Panel from '../../libs/Panel.js'

const game = Utils.createElement('div', null, ['game_container'])
const canvas = Utils.createElement('canvas', game, [], { width: 600, height: 600 })
const panel = Panel(canvas);

export const drawHook = (newState) => {
  console.log(newState)
}