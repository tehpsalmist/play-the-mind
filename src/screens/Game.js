import React, { useEffect } from 'react'
import { ApolloConsumer, Subscription } from 'react-apollo'
import gql from 'graphql-tag'
import { useAuth0 } from '../auth/Auth'
import { changeSubscriptionToken } from '../App'

const getGame = gameId => gql`
  subscription {
    games_by_pk(id: ${gameId}) {
      created
      finished
      id
      lives
      name
      owner_id
      player_count
      ready
      round {
        number_of_cards
        reward
      }
      stars
    }
  }
`

export const Game = ({ match }) => {
  const { idToken } = useAuth0()

  useEffect(() => {
    changeSubscriptionToken(idToken)
  }, [idToken])

  return <ApolloConsumer>
    {client => <Subscription subscription={getGame(match.params.id)} shouldResubscribe>
      {({ loading, error, data }) => {
        if (loading) return 'Loading Game...'
        if (error) return `Error Loading Game: ${error.message}`
        if (!data || !data.games_by_pk) return `No game data found.`

        const { games_by_pk: game } = data

        return <p>{JSON.stringify(game, null, 2)}</p>
      }}
    </Subscription>}
  </ApolloConsumer>
}
