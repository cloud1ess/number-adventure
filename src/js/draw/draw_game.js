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
        x: mapPos.x + convertGridToPixels(c) - halfGridSquareSize,
        y: mapPos.y + convertGridToPixels(r) - halfGridSquareSize,
        wid: gridSquareSize,
        hei: gridSquareSize
      });
    }
  }
}

const drawChars = (chars = [], panel, currentChar) => {
  chars.forEach((char, index) => {
    panel.drawRect({
      x: mapPos.x + convertGridToPixels(char.pos.c) - halfGridSquareSize,
      y: mapPos.y + convertGridToPixels(char.pos.r) - halfGridSquareSize,
      wid: gridSquareSize,
      hei: gridSquareSize,
      colour: index === currentChar? colours.currentChar : colours.char
    });
  })
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
    font: '50px Arial',
    x: 240,
    y: 60,    
    text: state.chars[state.currentChar].moves
  })

  endGOButton.setHitBox({ x1: 300, y1: hudPadding, x2: 300+ (hudButtonSize*3), y2: hudPadding + (hudButtonSize*2) })
  endGOButton.drawRect({
    x: 300,
    y: hudPadding,
    wid: hudButtonSize*3,
    hei: hudButtonSize*2,
    colour: colours.lrud
  });
}

const convertGridToPixels = (grid) => {
  return grid * gridSquareSize
}

export const init = (state, panel, setInteractive) => {
  initPanels(panel)
  initHud(panels.hud, setInteractive)
}

export const draw = (state) => {
  drawMap(state.map, panels.map)
  drawChars(state.chars, panels.chars, state.currentChar)
  drawHud(state)

  console.log("DRAW GAME")
}