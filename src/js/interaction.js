const callbacks = []

export const registerInteractionCallback = (callback) => {
  callbacks.push(callback)
}

export const setInteractiveHook = (panel, actionId, events = []) => {     
  events.forEach((eventType) => {
    panel.addEventCallback(eventType, ({type, x, y}) => {
      callbacks.forEach((callback) => {
        callback(actionId, {type, x, y})
      })
    })
  })
}

export const tearDown = () => {
  callbacks = []
}