import React, { Fragment } from 'react'
import { Chat } from '.';

export const FinishedGame = ({ game }) => {
  console.log(game)
  return <main className='flex-center flex-col'>
    <h1 className='text-3xl mb-2'>Game Over</h1>
    <p className='mb-2'>
      Players:
      <strong className='ml-1'>{game.players.map(player => player.name).join(' / ')}</strong>
    </p>
    <p className='mb-4'>Last Round: {game.round.name}</p>
    <h2 className='text-2xl mb-2'>Play Order</h2>
    <section className='w-full flex-1 overflow-y-scroll'>
      <ul className='flex flex-col items-stretch pb-4'>
        {game.plays.reverse().map((play, index, plays) => <Fragment key={play.id}>
          <li
            className={`play-order-grid ${play.reconciled ? 'border-red-500' : 'border-green-500'}`}
          >
            <span>{play.value}</span>
            <span>{play.round.name}</span>
            <span>{play.player.name}</span>
          </li>
          {
            plays[index + 1] && play.round_id !== plays[index + 1].round_id
              ? <hr className='w-full border border-blue-500' />
              : null}
        </Fragment>)}
      </ul>
    </section>
    <Chat game={game} />
  </main>
}
