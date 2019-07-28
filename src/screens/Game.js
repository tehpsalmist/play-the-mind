import React from 'react'
import { ApolloConsumer, Subscription } from 'react-apollo'
import { GamePrepGuest, GamePrepHost, GameBoard, FinishedGame } from '../components'
import { useAuth0 } from '../auth/Auth'
import { GAME } from '../queries'
import { EventMessage } from '../components';

export const Game = ({ match }) => {
  const { user } = useAuth0()

  return <ApolloConsumer>
    {client => <>
      <Subscription subscription={GAME} variables={{ gameId: +match.params.id }} shouldResubscribe>
        {({ loading, error, data }) => {
          if (loading) return 'Loading Game...'
          if (error) return `Error Loading Game: ${error.message}`
          if (!data || !data.games_by_pk) return `No game data found.`

          const { games_by_pk: game } = data
          const isOwner = game.owner_id === user.sub

          if (!game.started || !game.round) return isOwner ? <GamePrepHost game={game} /> : <GamePrepGuest game={game} />

          if (game.finished) return <FinishedGame game={game} />

          return <GameBoard game={game} isOwner={isOwner} />
        }}
      </Subscription>
      <EventMessage event='play' color='text-green-400' />
      <EventMessage event='pause' color='text-purple-500' />
      <EventMessage event='conflict' color='text-red-500' />
    </>}
  </ApolloConsumer>
}
