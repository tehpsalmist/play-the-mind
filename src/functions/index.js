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
