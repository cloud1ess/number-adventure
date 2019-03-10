export default function () {
  let frameBuffer = []
  let maxBufferSize = 1000

  function newFrame (diff) {
    frameBuffer.unshift(Math.floor(1000/diff))
    if (frameBuffer.length >= maxBufferSize) {
      frameBuffer.pop()
    }
  }

  function updateFPS () {
    // console.log(frameBuffer[0])
  }

  function getData () {
    return frameBuffer
  }

  function getAverage () {
    return frameBuffer.reduce(function (acc, value) {
      return acc+value
    }, 0) / frameBuffer.length
  }

  function clearData () {
    frameBuffer.length = 0;
  }

  return {
    newFrame: newFrame,
    getData: getData,
    getAverage: getAverage,
    clearData: clearData
  }
}
