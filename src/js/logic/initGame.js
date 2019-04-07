import { VIEWS } from './logic.js'
import Utils from '../../../libs/Utils.js'
import scenarios from '../data/scenarios.js'
import chars from '../data/chars.js'
import npcs from '../data/npcs.js'

const initScenario = () => {
  const scenario = Utils.copy(Utils.chooseRandom(scenarios))

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
      maxStars: 6,
      bonuses: [],
      description: 'Very strong'
    }

    Object.assign(charProps, Utils.copy(chars[charIndex]))

    charProps.actions = charProps.maxActions
    charProps.stars = charProps.maxStars

    return charProps
  })
}

const initNPCs = (npcs) => {
  npcs.forEach((npc) => {
    if (npc.quest) {
      Object.assign(npc, Utils.copy(Utils.chooseRandom(npcs)))
      Object.assign(npc.quest, {
        paidFor: false,
        complete: false,
        cost: 2,
        reqard: Math.floor(Math.random() * 3) + 1
      })
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