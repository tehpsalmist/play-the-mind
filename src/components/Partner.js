import React from 'react'
import { Card } from '.'

export const Partner = ({ partner, roundId }) => {
  const partnerCardsLength = partner.cards.length
  const partnerMeasurementLength = Math.floor(partnerCardsLength / 2)
  const revealedCardsLength = partner.revealed_cards.length
  const revealedMeasurementLength = Math.floor(revealedCardsLength / 2)

  return <li className='relative h-24'>
    <p>
      {partner.name}
      &nbsp;
      <span className={`state-bubble-small inline-block ${partner.ready ? 'bg-green-400' : 'bg-red-400'}`} />
      {partner.suggesting_star ? <span className='star-throbber'>&nbsp;&#x272F;</span> : null}
    </p>
    {partner.cards.map((card, i) => {
      const offset = partnerMeasurementLength - i
      const multiplier = (offset && offset / partnerCardsLength)
      const rotation = partnerCardsLength * 3 * multiplier
      const shiftX = partnerCardsLength * 5 * multiplier
      const shiftY = Math.abs(partnerCardsLength * 0 * multiplier)

      return <div
        key={card}
        className='center-partner-card border border-black bg-gray-300 rounded h-12 w-8'
        style={{
          zIndex: 40 - i,
          transform: `rotate(${rotation}deg) translateX(${shiftX}px) translateY(${shiftY}px)`
        }}
      />
    })}
    {partner.revealed_cards.filter(card => card.round_id === roundId).map((card, i) => {
      const offset = revealedMeasurementLength - i
      const multiplier = (offset && offset / revealedCardsLength)
      const rotation = revealedCardsLength * 5 * multiplier
      const shiftX = revealedCardsLength * 10 * multiplier
      const shiftY = Math.abs(revealedCardsLength * 0 * multiplier)

      return <Card
        key={card.value}
        value={card.value}
        classes='center-partner-revealed-card h-12 w-8'
        styles={{
          zIndex: 40 - i,
          transform: `rotate(${rotation}deg) translateX(${shiftX}px) translateY(${shiftY}px)`
        }}
      />
    })}
  </li>
}
