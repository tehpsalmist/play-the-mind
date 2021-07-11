import React, { useEffect, useState } from 'react'
import { animated, useTransition } from 'react-spring'

let id = 0
const config = { tension: 125, friction: 20, precision: 0.1, duration: 1000 }

export const EventMessage = ({ color, event }) => {
  const [messages, setMessages] = useState([])
  const transitions = useTransition(messages, {
    keys: m => m.key,
    from: { opacity: 0, transform: 'translateX(-50%) scale(0.5)' },
    enter: item => async next => {
      await next({ opacity: 1, transform: `translateX(-50%) scale(3)`, config: { ...config, duration: 500 } })
      await next({ opacity: 1, transform: `translateX(-50%) scale(2.5)`, config: { ...config, duration: 1500 } })
    },
    leave: item => async next => {
      await next({ opacity: 0, transform: `translateX(-50%) scale(10)`, config: { ...config, duration: 500 } })
    },
    expires: 200,
    onRest: (_, __, item) => {
      setMessages(state => state.filter(i => i.key !== item.key))
    }
  })

  const callback = e => setMessages(state => [...state, { message: e.detail, key: id++ }])

  useEffect(() => {
    const listener = addEventListener(event, callback)

    return () => removeEventListener(event, callback)
  }, [event, callback])

  return transitions((style, item) => <animated.h3 style={style} className={`fixed top-0 left-0 ml-1/2 mt-33vh z-50 ${color}`}>{item.message}</animated.h3>)
}
