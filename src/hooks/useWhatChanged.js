import { useEffect, useRef } from 'react'

export const deepEqual = (obj1, obj2) => {
  if (obj1 === obj2) {
    return true
  }

  if (obj1 == null || obj2 == null) {
    return false
  }

  if (typeof obj1 === 'object') {
    if (typeof obj2 !== 'object' || Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false
    }

    return Object.keys(obj1)
      .every(key => deepEqual(obj1[key], obj2[key]))
  }

  return false
}

export const useWhatChanged = (props, callback) => {
  const previousProps = useRef()

  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props })
      const changesObj = {}

      allKeys.forEach(key => {
        if (['plays', 'players'].some(k => key === k)) return

        if (!deepEqual(previousProps.current[key], props[key])) {
          changesObj[key] = {
            from: previousProps.current[key],
            to: props[key]
          }
        }
      })

      if (Object.keys(changesObj).length) {
        callback(changesObj)
      }
    }

    previousProps.current = props
  })
}
