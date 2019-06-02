import { VIEWS } from './logic.js'
import Utils from '../../../libs/Utils.js'
import Scenarios from '../data/scenarios.js'
import Chars from '../data/chars.js'
import Npcs from '../data/npcs.js'

const initScenario = () => {
  const scenario = Utils.copy(Utils.chooseRandom(Scenarios))

  return scenario
}

const initChars = (startLocs, charIndexes = [0, 1]) => {
  return charIndexes.map((charIndex, index) => {
    const charProps = {
      pos: {
        c: startLocs[index].c,
        r: startLocs[index].r
      },
      maxActions: 10,
      stars: 0,
      bonuses: [],
      items: [],
      description: 'Very strong'
    }

    Object.assign(charProps, Utils.copy(Chars[charIndex]))

    charProps.actions = charProps.maxActions

    return charProps
  })
}

const initNPCs = (npcs) => {
  npcs.forEach((npc) => {
    if (npc.quest) {
      Object.assign(npc, Utils.copy(Utils.chooseRandom(Npcs)))
    }
  })

  return npcs
}

export default (chars) => {
  const scenario = initScenario()

  return {
    camera: {
      pos: { x: 0, y: 0 },
      zoom: 1
    },
    chars: initChars(scenario.startLocs, chars),
    view: VIEWS.GAME,
    terrain: scenario.terrain,
    npcs: initNPCs(scenario.npcs)
  }
}