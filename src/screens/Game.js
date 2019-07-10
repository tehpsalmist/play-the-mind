import React from 'react'
import { ApolloConsumer, Subscription } from 'react-apollo'
import gql from 'graphql-tag'

const GAME = gql`
  subscription games_by_pk($gameId: Int!) {
    games_by_pk(id: $gameId) {
      id
      name
      created
      started
      finished
      lives
      stars
      owner_id
      player_count
      ready
      round {
        number_of_cards
        reward
      }
      players {
        id
        name
        cards
      }
    }
  }
`

export const Game = ({ match }) => {
  return <ApolloConsumer>
    {client => <Subscription subscription={GAME} variables={{ gameId: +match.params.id }} shouldResubscribe>
      {({ loading, error, data }) => {
        if (loading) return 'Loading Game...'
        if (error) return `Error Loading Game: ${error.message}`
        if (!data || !data.games_by_pk) return `No game data found.`

        const { games_by_pk: game } = data

        console.log(game)
        return <p>{JSON.stringify(game, null, 2)}</p>
      }}
    </Subscription>}
  </ApolloConsumer>
}
