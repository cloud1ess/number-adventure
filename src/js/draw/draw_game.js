import Panel from "../../../libs/Panel";
import { ACTIONS } from "../logic";

const gridSquareSize = 32
const halfGridSquareSize = gridSquareSize / 2
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

const colours = {
  char: 'rgb(244, 122, 66)',
  currentChar: 'rgb(168, 38, 33)',
  challenge: 'rgb(23, 107, 55)',
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
}

const drawMap = (map = {}, panel) => {
  panel.drawRect({
    x: 0,
    y: 0,
    wid: canvasWidth,
    hei: canvasHeight,
    colour: 'rgb(51, 178, 77)'
  });
  for (let c = 0; c < map.width; c++) {
    for (let r = 0; r < map.height; r++) {
      panel.drawStrokeRect({
        x: convertGridToRender(c, 'x'),
        y: convertGridToRender(r, 'y'),
        wid: gridSquareSize,
        hei: gridSquareSize
      });
    }
  }
}

const drawInterestingThings = (interestingThings = [], panel) => {
  interestingThings.forEach((interestingThing) => {
    panel.drawRect({
      x: convertGridToRender(interestingThing.pos.c, 'x'),
      y: convertGridToRender(interestingThing.pos.r, 'y'),
      wid: gridSquareSize,
      hei: gridSquareSize,
      colour: interestingThing.challenge ? colours.challenge : colours.shop
    });
    if (interestingThing.challenge && interestingThing.challenge.actionCost) {
      panel.drawText({
        x: convertGridToRender(interestingThing.pos.c, 'x')+5,
        y: convertGridToRender(interestingThing.pos.r, 'y')+25,
        text: interestingThing.challenge.actionCost,
        font: '20px Ariel'
      });
    }
  })
}

const drawChars = (chars = [], panel, currentChar) => {
  chars.forEach((char, index) => {
    panel.drawRect({
      x: convertGridToRender(char.pos.c, 'x'),
      y: convertGridToRender(char.pos.r, 'y'),
      wid: gridSquareSize,
      hei: gridSquareSize,
      colour: index === currentChar? colours.currentChar : colours.char
    });
  })
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
    text: `Actions: ${state.chars[state.currentChar].actions}`
  })
  hudContainer.drawText({
    font: '35px Arial',
    x: 240,
    y: 110,    
    text: `Stars: ${state.chars[state.currentChar].stars}/${state.chars[state.currentChar].maxStars}`
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

const convertGridToRender = (grid, xOrY) => {
  return mapPos[xOrY] + (grid * gridSquareSize) - halfGridSquareSize
}

export const init = (state, panel, setInteractive) => {
  initPanels(panel)
  initHud(panels.hud, setInteractive)
}

export const draw = (state) => {
  drawMap(state.map, panels.map)
  drawInterestingThings(state.interestingThings, panels.map)
  drawChars(state.chars, panels.chars, state.currentChar)
  drawHud(state)

  console.log("DRAW GAME")
}