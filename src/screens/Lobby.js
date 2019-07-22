import React from 'react'
import { Link } from 'react-router-dom'
import { ApolloConsumer, Subscription, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { useAuth0 } from '../auth/Auth'
import { PleaseLogin } from '../auth/PleaseLogin'

const USER_GAMES = gql`
  subscription games($userId: String) {
    games(where: {players: {user_id: {_eq: $userId}}}) {
      id
      name
      player_count
      players {
        id
        name
        user_id
      }
      lives
      is_full
      owner_id
      stars
      created_at
      finished
      round {
        id
        number_of_cards
        is_blind
      }
    }
  }
`

const AVAILABLE_GAMES = gql`
  subscription games($userId: String) {
    games(where: {_not: {players: {user_id: {_eq: $userId}}}, is_full: {_eq: false}}) {
      id
      name
      player_count
      players {
        id
        name
        user_id
      }
      lives
      is_full
      stars
      created_at
      round {
        number_of_cards
        is_blind
      }
    }
  }
`

const JOIN_GAME = gql`
  mutation insert_players($gameId: Int, $name: String) {
    insert_players(objects: {game_id: $gameId, name: $name}) {
      returning {
        id
      }
    }
  }
`

const LEAVE_GAME = gql`
  mutation delete_players($playerId: Int) {
    delete_players(where: {id: {_eq: $playerId}}) {
      affected_rows
    }
  }
`

export const Lobby = ({ history }) => {
  const { authToken, user } = useAuth0()

  return <ApolloConsumer>
    {client => <>
      <p className='text-center'>Play the Mind. Become the Mind.</p>
      {!authToken ? <PleaseLogin /> : <ul className='w-full flex flex-col-reverse items-stretch'>
        <Subscription subscription={AVAILABLE_GAMES} variables={{ userId: user && user.sub }}>
          {({ loading, error, data }) => {
            if (error) {
              console.log(error)
              return null
            }
            if (loading || error || !data) return null

            return (<>
              {data.games
                .map(game => <li
                  to={`/game/${game.id}`}
                  className='p-3 m-1 flex justify-between items-center border rounded-lg cursor-pointer'
                  key={game.id}
                >
                  <span>{game.name}</span>
                  <strong className='ml-2'>{game.players.length}/{game.player_count}</strong>
                  <span className='mx-auto hidden sm:block'>
                    <em className='mx-1'>Players:</em>
                    {game.players.map(p => <strong className='mx-1' key={p.id}>{p.name}</strong>)}
                  </span>
                  <Mutation mutation={JOIN_GAME}>
                    {(joinGame, { data, called, loading }) => {
                      if (called && data) {
                        const gameId = game.id

                        setTimeout(() => {
                          history.push(`/game/${gameId}`)
                        }, 1000)
                      }

                      return <button
                        className={`p-2 ${loading ? 'bg-gray-600' : 'bg-blue-500'} text-white rounded`}
                        onClick={e => {
                          e.preventDefault()

                          !loading && joinGame({
                            variables: { gameId: game.id, name: user.name }
                          })
                        }}
                      >
                        Join
                      </button>
                    }}
                  </Mutation>
                </li>)}
            </>)
          }}
        </Subscription>
        <Subscription subscription={USER_GAMES} variables={{ userId: user && user.sub }}>
          {({ loading, error, data }) => {
            if (error) return `Error: ${error.message}`
            if (loading || !data) return 'Finding Games...'

            return (<>
              {data.games
                .map(game => <li
                  to={`/game/${game.id}`}
                  className='p-3 m-1 flex justify-between items-center border rounded-lg cursor-pointer'
                  key={game.id}
                >
                  <span>{game.name}</span>
                  <strong className='ml-2'>{game.players.length}/{game.player_count}</strong>
                  <span className='mx-auto hidden sm:flex sm:flex-wrap'>
                    <em className='mx-1'>Players:</em>
                    {game.players.map(p => <strong className='mx-1' key={p.id}>{p.name}</strong>)}
                  </span>
                  <Link className='mr-2 p-2 bg-green-500 text-white rounded' to={`/game/${game.id}`}>
                    {game.finished ? 'View' : 'Play'}
                  </Link>
                  {!game.finished && <Mutation mutation={LEAVE_GAME}>
                    {(leaveGame, { loading }) => {
                      const isOwned = game.owner_id === user.sub

                      return <button
                        className={`p-2 ${loading ? 'bg-gray-600' : isOwned ? 'bg-red-600' : 'bg-orange-500'} text-white rounded`}
                        onClick={e => {
                          e.preventDefault()

                          !loading && leaveGame({
                            variables: { playerId: game.players.find(p => p.user_id === user.sub).id }
                          })
                        }}
                      >
                        {isOwned ? 'Delete' : 'Leave'}
                      </button>
                    }}
                  </Mutation>}
                </li>)}
            </>)
          }}
        </Subscription>
      </ul>}
    </>}
  </ApolloConsumer>
}
