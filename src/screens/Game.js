import React from 'react'
import { ApolloConsumer, Subscription } from 'react-apollo'
import gql from 'graphql-tag'
import { GamePrepGuest, GamePrepHost, GameBoard } from '../components'
import { useAuth0 } from '../auth/Auth'

const GAME = gql`
  subscription games_by_pk($gameId: Int!) {
    games_by_pk(id: $gameId) {
      id
      name
      is_full
      lives
      stars
      started
      ready
      in_conflict
      transitioning_round
      finished
      player_count
      players {
        id
        name
        user_id
        suggesting_star
        cards
        ready
      }
      round {
        id
        number_of_cards
        is_blind
        reward
      }
      plays(order_by: {timestamp: desc, round_id: desc}) {
        id
        player_id
        reconciled
        round_id
        timestamp
        value
      }
      revealed_cards(order_by: {timestamp: desc, round_id: desc}) {
        id
        player_id
        round_id
        timestamp
        value
      }
      finished_at
      created_at
      owner_id
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
        const isOwner = game.owner_id === user.sub

        if (!game.started || !game.round) return isOwner ? <GamePrepHost game={game} /> : <GamePrepGuest game={game} />

        return <GameBoard game={game} isOwner={isOwner} />
      }}
    </Subscription>}
  </ApolloConsumer>
}
