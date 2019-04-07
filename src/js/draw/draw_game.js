import Panel from "../../../libs/Panel";
import { ACTIONS } from "../logic/logic";
import Terrain from "../data/terrain";

const gridSquareSize = 48
const canvasWidth = 600
const canvasHeight = 600
const hudPadding = 16
const hudButtonSize = 50

let hudContainer
let upButton
let leftButton
let downButton
let rightButton
let endGOButton
let acceptQuestButton

const colours = {
  char: 'rgb(244, 122, 66)',
  currentChar: 'rgb(168, 38, 33)',
  quest: 'rgb(89, 5, 86)',
  shop: 'rgb(89, 5, 86)',
  lrud: 'rgb(153, 47, 149)'
}

let mapPos = {
  x: 0,
  y: 0
}

const panels = {}

const initPanels = (panel) => {
  panels.map = new Panel()
  panels.chars = new Panel()
  panels.hud = new Panel()

  panel.addChild(panels.map)
  panel.addChild(panels.chars)
  panel.addChild(panels.hud)
}

const initHud = (panel, setInteractive) => {
  if (hudContainer) hudContainer.tearDown()

  hudContainer = new Panel()
  panel.addChild(hudContainer)
  
  upButton = new Panel()
  hudContainer.addChild(upButton)
  setInteractive(upButton, ACTIONS.UP, ['mousedown'])
  
  leftButton = new Panel()
  hudContainer.addChild(leftButton)
  setInteractive(leftButton, ACTIONS.LEFT, ['mousedown'])
  
  downButton = new Panel()
  hudContainer.addChild(downButton)
  setInteractive(downButton, ACTIONS.DOWN, ['mousedown'])
  
  rightButton = new Panel()
  hudContainer.addChild(rightButton)
  setInteractive(rightButton, ACTIONS.RIGHT, ['mousedown'])

  endGOButton = new Panel()
  hudContainer.addChild(endGOButton)
  setInteractive(endGOButton, ACTIONS.ENDGO, ['mousedown'])

  acceptQuestButton = new Panel()
  panel.addChild(acceptQuestButton)
}

const drawTerrain = (terrain = [], panel, camera) => {
  panel.drawRect({
    x: 0,
    y: 0,
    wid: canvasWidth,
    hei: canvasHeight,
    colour: Terrain[0].colour
  });
  let renderSize = scaleForRender(gridSquareSize, camera)
  
  terrain.forEach((row, r) => {
    row.forEach((terrainIndex, c) => {
      let renderPos = convertGridToRender({r, c}, camera)
      panel.drawRect({
        x: renderPos.x,
        y: renderPos.y,
        wid: renderSize,
        hei: renderSize,
        colour: Terrain[terrainIndex].colour,
        stroke: {
          strokeStyle: '#000000',
          lineWidth: 1
        }
      });
    })
  })
}

const drawNPCs = (npcs = [], panel, camera) => {
  let renderSize = scaleForRender(gridSquareSize, camera)
  npcs.forEach((npc) => {
    let renderPos = convertGridToRender(npc.pos, camera)
    panel.drawRect({
      x: renderPos.x,
      y: renderPos.y,
      wid: renderSize,
      hei: renderSize,
      colour: npc.quest ? colours.quest : colours.shop
    });
    if (npc.quest && npc.quest.reward) {
      panel.drawText({
        x: renderPos.x+5,
        y: renderPos.y+25,
        text: npc.quest.reward,
        font: '20px Ariel',
        colour: '#111111'
      });
    }
  })
}

const drawChars = (chars = [], panel, currentChar, camera) => {
  chars.forEach((char, index) => {
    let renderPos = convertGridToRender(char.pos, camera)
    let renderSize = scaleForRender(gridSquareSize, camera)
    panel.drawRect({
      x: renderPos.x,
      y: renderPos.y,
      wid: renderSize,
      hei: renderSize,
      colour: index === currentChar? colours.currentChar : colours.char
    });
  })
}

const drawSpeech = (speech, chars, npcs, setInteractive) => {
  setInteractive(acceptQuestButton, ACTIONS.ACCEPT_QUEST, ['mousedown'], true)  

  if (speech) {
    let char = chars[speech.charIndex]
    let npc = npcs[speech.npcIndex]
    let quest = npc.quest

    if (quest) {
      if (!quest.paidFor) {
        drawLargeSpeachBubble(
          char,
          `Cost: ${quest.cost}
  Reward: ${quest.reward} Stars\n
  Hello ${char.name}
  My quest is a hard one\nwan't to try?`,
          300,
          200,
          true,
          setInteractive
        )
        // panels.hud.drawText({
        //   x: convertGridToRender(npc.pos.c, 'x')+5,
        //   y: convertGridToRender(npc.pos.r, 'y')+25,
        //   text: `Pay ${quest.cost} Actions and recieve upto ${quest.reward[0]} stars`,
        //   font: '20px Ariel'
        // });
        // panels.hud.drawText({
        //   x: convertGridToRender(npc.pos.c, 'x')+5,
        //   y: convertGridToRender(npc.pos.r, 'y')+25,
        //   text: `Pay ${quest.cost} Actions and recieve upto ${quest.reward[0]} stars`,
        //   font: '20px Ariel'
        // });
      } else {
        drawLargeSpeachBubble(
          char,
          quest.question,
          300,
          200
        )
      }
    }
  }
}

const drawLargeSpeachBubble = (char, text, wid, hei, buttonCallback, setInteractive) => {
  let panel = panels.hud

  const x = (canvasWidth - wid) / 2
  const y = (canvasHeight - hei) /2
  const p = 10
  const lineheight = 20;

  panel.drawRect({
    x: x,
    y: y,
    wid: wid,
    hei: hei,
    colour: '#EEEEEE',
    rounded: 10,
    stroke: {
      lineWidth: 2,
	    strokeStyle: '#000000'
    }
  });
  text.split('\n').forEach((line, index) => {
    panel.drawText({
      x: x + p,
      y: y + p + (lineheight * (index+1)),
      text: line,
      font: '20px Ariel',
      colour: '#111111'
    });
  })
  if (buttonCallback) {

    const bw =  100
    const bh =  50
    const bx =  (canvasWidth - bw) / 2
    const by =  y + hei - p - bh
    panel.drawRect({
      x: bx,
      y: by,
      wid: bw,
      hei: bh,
      colour: colours.lrud,
      rounded: 5,
      stroke: {
        lineWidth: 2,
        strokeStyle: '#000000'
      }
    });
    acceptQuestButton.setHitBox({ 
      x1: bx, 
      y1: by, 
      x2: bx + bw, 
      y2: by + bh 
    })
    setInteractive(acceptQuestButton, ACTIONS.ACCEPT_QUEST, ['mousedown'])
  }
}

const drawHud = (state) => {  
  hudContainer.setPos({
    x: 0,
    y: canvasHeight - (hudButtonSize * 2) - (hudPadding * 3)
  })

  const LRUD = [{
    x: (hudPadding * 2) + hudButtonSize,
    y: hudPadding,
    panel: upButton
  }, {
    x: hudPadding,
    y: (hudPadding * 2) + hudButtonSize,
    panel: leftButton
  }, {
    x: (hudPadding * 2) + hudButtonSize,
    y: (hudPadding * 2) + hudButtonSize,
    panel: downButton
  }, {
    x: (hudPadding * 3) + (hudButtonSize * 2),
    y: (hudPadding * 2) + hudButtonSize,
    panel: rightButton
  }]

  LRUD.forEach((button) => {
    button.panel.setHitBox({ x1: button.x, y1: button.y, x2: button.x + hudButtonSize, y2: button.y + hudButtonSize })
    button.panel.drawRect({
      x: button.x,
      y: button.y,
      wid: hudButtonSize,
      hei: hudButtonSize,
      colour: colours.lrud
    });
  })

  hudContainer.drawText({
    font: '35px Arial',
    x: 240,
    y: 60,    
    text: `Actions: ${state.chars[state.currentChar].actions}`,
    colour: '#111111'
  })
  hudContainer.drawText({
    font: '35px Arial',
    x: 240,
    y: 110,    
    text: `Stars: ${state.chars[state.currentChar].stars}/${state.chars[state.currentChar].maxStars}`,
    colour: '#111111'
  })

  endGOButton.setHitBox({ x1: 420, y1: hudPadding, x2: 420 + (hudButtonSize*3), y2: hudPadding + (hudButtonSize*2) })
  endGOButton.drawRect({
    x: 420,
    y: hudPadding,
    wid: hudButtonSize*3,
    hei: hudButtonSize*2,
    colour: colours.lrud
  });
}

const convertGridToRender = (grid, camera) => {
  const renderGridSize = scaleForRender(gridSquareSize, camera)
  return {
    x: ((-camera.pos.c + grid.c - 0.5) * renderGridSize) + (canvasWidth/2),
    y: ((-camera.pos.r + grid.r - 0.5) * renderGridSize) + (canvasHeight/2),
  }
}

const scaleForRender = (origSize, camera) => {
  return origSize * camera.zoom
}

export const init = (state, panel, setInteractive) => {
  initPanels(panel)
  initHud(panels.hud, setInteractive)
}

export const draw = (state, setInteractive) => {
  drawTerrain(state.terrain, panels.map, state.camera)
  drawNPCs(state.npcs, panels.map, state.camera)
  drawChars(state.chars, panels.chars, state.currentChar, state.camera)
  drawSpeech(state.speech, state.chars, state.npcs, setInteractive)
  drawHud(state)
}