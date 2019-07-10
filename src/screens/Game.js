import React from 'react'
import { ApolloConsumer, Subscription } from 'react-apollo'
import gql from 'graphql-tag'
import { GamePrepGuest, GamePrepHost } from '../components'
import { useAuth0 } from '../auth/Auth'

const GAME = gql`
  subscription games_by_pk($gameId: Int!) {
    games_by_pk(id: $gameId) {
      id
      name
      player_count
      players {
        id
        name
        user_id
        cards
      }
      lives
      is_full
      stars
      created
      round {
        number_of_cards
        is_blind
        reward
      }
      finished
      owner_id
      plays(order_by: {round_id: asc}) {
        id
        out_of_order
        penalized
        round_id
        timestamp
        value
      }
      ready
      started
    }
  }
`

export const Game = ({ match }) => {
  const { user } = useAuth0()
  return <ApolloConsumer>
    {client => <Subscription subscription={GAME} variables={{ gameId: +match.params.id }} shouldResubscribe>
      {({ loading, error, data }) => {
        if (loading) return 'Loading Game...'
        if (error) return `Error Loading Game: ${error.message}`
        if (!data || !data.games_by_pk) return `No game data found.`

        const { games_by_pk: game } = data

        if (!game.started) return game.owner_id === user.sub ? <GamePrepHost game={game} /> : <GamePrepGuest game={game} />

        return <p>{JSON.stringify(game, null, 2)}</p>
      }}
    </Subscription>}
  </ApolloConsumer>
}
