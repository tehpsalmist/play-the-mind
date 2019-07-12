import React from 'react'
import { useAuth0 } from '../auth/Auth'

export const GameBoard = ({ game, isOwner }) => {
  const { user } = useAuth0()
  const [player, ...partners] = game.players.sort((a, b) => a.user_id === user.sub ? -1 : b.user_id === user.sub ? 1 : 0)

  return <main>
    <section style={{
      display: 'grid',
      gridTemplate: `1fr / repeat(${game.player_count}, 1fr)`
    }}>
      {
        game.players.map(player => <div key={player.id} className='flex-center flex-col'>
          <p>{player.name}</p>
          {
            player.cards.map(card => <p key={card}>{card}</p>)
          }
        </div>)
      }
    </section>
  </main>
}
