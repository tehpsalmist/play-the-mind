import React, { useLayoutEffect, useState } from 'react'
import { Card } from '.'
import { useMedia, useStore } from '../hooks'
import { getOffset } from '../functions'

export const PlayedCards = ({ cards = [], game }) => {
  const [coords, setCoords] = useStore('last-card-coords', { left: 0, top: 0 })
  const [partnerMap] = useStore('partners', {})
  const [cardMap, setCardMap] = useState({})
  const [verticalShift, xShift, baseGap, groupSize, topPadding] = useMedia(
    ['(min-width: 768px)'],
    [[30, 30, 60, 10, 112]],
    [15, 15, 30, 8, 76]
  )

  const cardsRemainder = groupSize - (cards.length % groupSize)

  const groups = cards.reduce((groups, card, i) => {
    if ((i + cardsRemainder) % groupSize === 0) {
      groups.push([card])
    } else {
      groups[groups.length - 1].push(card)
    }

    return groups
  }, [[]])

  const baseTop = (groups.length * verticalShift) + baseGap

  useLayoutEffect(() => {
    const container = document.getElementById('played-cards')
    const { left, width } = getOffset(container)

    if (
      coords.left !== left + ((width - ((cardsRemainder - 1) * xShift)) / 2) ||
      coords.top !== topPadding + (baseTop - (verticalShift * 2))
    ) {
      setCoords({ left: left + ((width - ((cardsRemainder - 1) * xShift)) / 2), top: topPadding + (baseTop - (verticalShift * 2)) })
    }

    if (cards.length > 3 && Object.keys(cardMap).length !== cards.slice(3).length) {
      setCardMap(cards.slice(3).reduce((map, card) => ({ ...map, [card.value]: true }), {}))
    }
  })

  return groups.map((group, gi) => {
    const cardsLength = group.length
    const measurementLength = Math.floor(cardsLength / 2)

    return group.map((card, ci) => {
      const offset = measurementLength - ci
      const multiplier = (offset && offset / cardsLength)
      const shiftX = cardsLength * xShift * multiplier
      const animationName = !cardMap[card.value] ? partnerMap[card.player_id] || '' : ''

      return <Card
        key={card.value}
        value={card.value}
        classes={`absolute medium-card ${animationName} center-player-card ${card.reconciled ? ' border-red-500' : ci + gi === 0 ? 'border-blue-400' : ''}`}
        styles={{
          zIndex: 50 - ((gi * groupSize) + ci),
          top: `${baseTop - ((gi + 1) * verticalShift)}px`,
          transform: `translateX(${shiftX}px)`
        }} />
    })
  })
}
