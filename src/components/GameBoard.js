import React from 'react'
import { useAuth0 } from '../auth/Auth'
import { Card, PlayableCard, ReadyButton, StarButton, Partner, PlayedCards, Chat } from '.'
import { useMedia, useStore, useWhatChanged } from '../hooks'
import { changeHappened } from '../functions'

export const GameBoard = ({ game, isOwner, viewSummary }) => {
  useWhatChanged(game, changes => {
    // console.log(changes)
    let conflict = false
    let newRound = false

    if (changeHappened(changes, 'in_conflict', false, true)) {
      dispatchEvent(new CustomEvent('conflict', {
        detail: 'Oh No!'
      }))
      conflict = true
    }

    if (changeHappened(changes, 'transitioning_round', false, true)) {
      newRound = true
      dispatchEvent(new CustomEvent('pause', {
        detail: <p>{game.round.name}<br />Complete!</p>
      }))
    }

    if (!conflict && !newRound && changeHappened(changes, 'ready', true, false)) {
      dispatchEvent(new CustomEvent('pause', {
        detail: 'Game Paused'
      }))
    }

    if (changeHappened(changes, 'ready', false, true)) {
      dispatchEvent(new CustomEvent('play', {
        detail: 'Play!'
      }))
    }
  })
  // console.log(game)
  const { user } = useAuth0()
  const reward = game.round.reward
    ? game.round.reward === 'life'
      ? <span>(&#128007;)</span>
      : <span>(&#x272F;)</span>
    : ''

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
      <div style={{ gridArea: 'top-bar' }} className='flex items-center justify-between md:justify-around text-base md:text-3xl md:p-2'>
        <h1 className='max-w-2/5 truncate'>{game.name}</h1>
        <h2 className='truncate'>{game.round.name}&nbsp;{reward}</h2>
        <ul className='flex'>
          {Array(game.stars).fill(1).map((x, i) => <li key={i}>&#x272F;</li>)}
        </ul>
        <ul className='flex'>
          {Array(game.lives).fill(1).map((x, i) => <li key={i}>&#128007;</li>)}
          {game.finished && <button className='bg-purple-500 rounded text-white px-1 md:p-2 md:text-xl' onClick={viewSummary}>Game Summary</button>}
        </ul>
      </div>
      <ul style={{ gridArea: 'partners' }} className='flex flex-1 flex-col justify-center md:justify-around'>
        {partners.map(partner => <Partner key={partner.id} partner={partner} roundId={game.round.id} />)}
      </ul>
      <div id='played-cards' style={{ gridArea: 'played-cards' }} className='relative'>
        <PlayedCards cards={playedCards} game={game} />
      </div>
    </section>
    <section className='flex flex-col-reverse text-center h-1/2'>
      <div className='w-full h-full relative flex justify-between md:justify-around items-start'>
        {game.stars ? <StarButton player={player} game={game} /> : null}
        <span className={`${player.ready ? 'bg-green-400' : 'bg-red-500'} state-bubble`}>
          <span style={{ transform: 'translateX(12%)' }}>{player.ready ? '👍' : '✋'}</span>
        </span>
        <ReadyButton player={player} />
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
        {
          player.revealed_cards.filter(card => card.round_id === game.round.id).map((card, i) => {
            const revealedCardsLength = player.revealed_cards.length
            const offset = Math.floor(revealedCardsLength / 2) - i
            const multiplier = (offset && offset / revealedCardsLength)
            const rotation = revealedCardsLength * 5 * multiplier
            const shiftX = revealedCardsLength * 10 * multiplier
            const shiftY = Math.abs(revealedCardsLength * 0 * multiplier)

            return <Card
              key={card.value}
              value={card.value}
              classes='center-player-revealed-card h-12 w-8'
              styles={{
                zIndex: 40 - i,
                transform: `rotate(${rotation}deg) translateX(${shiftX}px) translateY(${shiftY}px)`
              }}
            />
          })
        }
      </div>
    </section>
    <Chat game={game} />
  </main>
}
