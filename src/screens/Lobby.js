import React from 'react'
import { Link } from 'react-router-dom'
import { ApolloConsumer, Subscription } from 'react-apollo'
import gql from 'graphql-tag'
import { useAuth0 } from '../auth/Auth'
import { PleaseLogin } from '../auth/PleaseLogin'

const ALL_GAMES = gql`
  subscription {
    games {
      id
      name
      player_count
      lives
      stars
      round {
        number_of_cards
        is_blind
      }
    }
  }
`

export const Lobby = props => {
  const { idToken } = useAuth0()

  return <ApolloConsumer>
    {client => <>
      <p className='text-center'>Play the Mind. Become the Mind.</p>
      <Subscription subscription={ALL_GAMES} shouldResubscribe>
        {({ loading, error, data }) => {
          if (loading) return 'Finding Games...'
          if (error) return `Error! ${error.message}`
          if (!idToken) return <PleaseLogin />
          if (!data) return `No Games at this time`

          return (
            <ul className='w-full flex flex-col-reverse items-stretch'>
              {data.games.map(game => <Link
                to={`/game/${game.id}`}
                className='p-3 m-1 flex justify-between border rounded-lg cursor-pointer'
                key={game.id}
              >
                <span>{game.name}</span>
                <span>Players: {game.player_count}</span>
                <span>Lives: {game.lives}</span>
                <span>Stars: {game.stars}</span>
              </Link>)}
            </ul>
          )
        }}
      </Subscription>
    </>}
  </ApolloConsumer>
}
