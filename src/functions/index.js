export const getOffset = element => {
  if (!element) return {}
  const bodyRect = document.body.getBoundingClientRect()
  const elemRect = element.getBoundingClientRect()

  return {
    left: elemRect.left - bodyRect.left,
    top: elemRect.top - bodyRect.top,
    width: elemRect.width
  }
}

export const changeHappened = (changes, key, from, to) => {
  if (changes[key]) {
    if (changes[key].from === from && changes[key].to === to) {
      return true
    }
  }

  return false
}
