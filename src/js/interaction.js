const callbacks = []

export const registerInteractionCallback = (callback) => {
  callbacks.push(callback)
}

export const setInteractiveHook = (panel, actionId, events = [], remove, data) => {
  events.forEach((eventType) => {
    if (remove) {
      panel.removeEventCallback(eventType)
    } else {
      panel.addEventCallback(eventType, ({type, x, y}) => {
        callbacks.forEach((callback) => {
          callback(actionId, {type, x, y, data})
        })
      })
    }
  })
}

export const tearDown = () => {
  callbacks = []
}