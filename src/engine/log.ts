
export const isLogEnabled = () => {
  return Memory['enableLog']
}

export const log = (...messages: any[]): void => {
  if (isLogEnabled()) {
    console.log(`[${Game.time}]`, ...messages)
  }
}

export const enableLog = () => {
  Memory['enableLog'] = true
}

export const disableLog = () => {
  Memory['enableLog'] = false
}
