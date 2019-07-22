import React, { useLayoutEffect, useRef, useState } from 'react'
import { animated, useSpring, config } from 'react-spring'
import { Card } from '.'
import { useStore } from '../hooks'
import { getOffset } from '../functions'

export const AnimatingCard = ({ x, y, rotation, value, styles, classes }) => {
  const [coords] = useStore('last-card-coords', { left: 0, top: 0 })
  const [animating, setAnimating] = useState(false)
  const ref = useRef()
  const [props, set] = useSpring(() => ({
    transform: `translateX(${x}px) translateY(${y}px) rotate(${rotation}deg) scale(1)`
  }))

  useLayoutEffect(() => {
    if (animating) return

    setAnimating(true)
    const offset = getOffset(ref.current)

    const destinationX = x + (coords.left - offset.left)
    const destinationY = y + (coords.top - offset.top)

    set({
      transform: `translateX(${destinationX}px) translateY(${destinationY}px) rotate(0) scale(0.8)`,
      config: config.default
    })
  })

  return <animated.div ref={ref} className={classes} style={{ ...props, ...styles, zIndex: 60 }}>
    <Card classes='big-card' value={value} />
  </animated.div>
}
