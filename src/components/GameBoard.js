import React from 'react'
import { useAuth0 } from '../auth/Auth'
import { Card, PlayableCard, ReadyButton, StarButton, Partner, PlayedCards } from '.'
import { useMedia, useStore } from '../hooks'

export const GameBoard = ({ game, isOwner }) => {
  // console.log(game)
  const { user } = useAuth0()
  const [player, ...partners] = game.players.sort((a, b) => a.user_id === user.sub ? -1 : b.user_id === user.sub ? 1 : 0)
  useStore('partners', partners.reduce((map, partner, i) => ({
    ...map,
    [partner.id]: `partner-animation-${i + 1}-${partners.length}`
  }), {}))
  const playedCards = game.plays
    .filter(play => play.round_id === game.round.id)
    .sort((a, b) => b.value - a.value)

  const [xOffset, yOffset] = useMedia(['(min-width: 768px)'], [[25, 2]], [15, 1])

  const cardsLength = player.cards.length
  const measurementLength = Math.floor(cardsLength / 2)

  return <main>
    <section className='h-1/2 playing-area-grid'>
      <div style={{ gridArea: 'top-bar' }} className='flex items-center justify-between text-base md:text-3xl md:p-2'>
        <h1 className='max-w-2/5 truncate'>{game.name}</h1>
        <h2 className='truncate'>{game.round.name}</h2>
        <ul className='flex'>
          {Array(game.stars).fill(1).map((x, i) => <li key={i}>&#x272F;</li>)}
        </ul>
        <ul className='flex'>
          {Array(game.lives).fill(1).map((x, i) => <li key={i}>&#128007;</li>)}
        </ul>
        <div className={`state-bubble ${game.in_conflict ? 'bg-red-500' : game.ready ? 'bg-green-400' : 'bg-yellow-500'}`} />
      </div>
      <ul style={{ gridArea: 'partners' }} className='flex flex-1 flex-col justify-around'>
        {partners.map(partner => <Partner key={partner.id} partner={partner} roundId={game.round.id} />)}
      </ul>
      <div id='played-cards' style={{ gridArea: 'played-cards' }} className='relative'>
        <PlayedCards cards={playedCards} game={game} />
      </div>
    </section>
    <section className='flex flex-col-reverse text-center h-1/2'>
      <p className='mb-2'>{player.name}</p>
      <div className='w-full h-full relative'>
        {
          player.cards.map((card, i, allCards) => {
            const offset = measurementLength - i
            const multiplier = (offset && offset / cardsLength)
            const rotation = cardsLength * 5 * multiplier
            const shiftX = cardsLength * xOffset * multiplier
            const shiftY = Math.abs(cardsLength * yOffset * multiplier)

            return i === 0
              ? <PlayableCard
                key={card}
                value={card}
                game={game}
                player={player}
                rotation={rotation}
                shiftX={shiftX}
                shiftY={shiftY}
                styles={{ zIndex: 40 - i }}
                classes='center-player-card big-card cursor-pointer'
              />
              : <Card
                key={card}
                value={card}
                styles={{
                  zIndex: 40 - i,
                  transform: `rotate(${rotation}deg) translateX(${shiftX}px) translateY(${shiftY}px)`
                }}
                classes='center-player-card big-card'
              />
          })
        }
        {game.stars ? <StarButton player={player} game={game} /> : null}
        <ReadyButton player={player} />
      </div>
    </section>
  </main>
}
