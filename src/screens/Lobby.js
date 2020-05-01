import React from 'react'
import { Link } from 'react-router-dom'
import { ApolloConsumer, Subscription, Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { useAuth0 } from '../auth/Auth'
import { PleaseLogin } from '../auth/PleaseLogin'
import { Chat } from '../components'
import { USER_GAMES, AVAILABLE_GAMES, LEAVE_GAME, JOIN_GAME } from '../queries'

export const Lobby = ({ history }) => {
  const { authToken, user } = useAuth0()

  return <ApolloConsumer>
    {client => <>
      <p className='text-center'><em>Play the Mind. Become the Mind.</em></p>
      {!authToken ? <PleaseLogin /> : <>
        <ul className='w-full flex flex-col items-stretch mb-12'>
          <li className='p-2 text-green-500'>Your Games:</li>
          <Subscription subscription={USER_GAMES} variables={{ userId: user && user.sub }}>
            {({ loading, error, data }) => {
              if (error) return `Error: ${error.message}`
              if (loading) return 'Loading Your Games...'
              if (!data || !data.games || !data.games.length) return <li className='p-2 text-red-500'>No Games Joined or Created.</li>

              return (<>
                {data.games
                  .map(game => <li
                    to={`/game/${game.id}`}
                    className='p-3 m-1 flex justify-between items-center border rounded-lg'
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
                    {!game.started && <Mutation mutation={LEAVE_GAME}>
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
          <li className='p-2 text-green-500'>Available Games:</li>
          <Subscription subscription={AVAILABLE_GAMES} variables={{ userId: user && user.sub }}>
            {({ loading, error, data }) => {
              if (error) {
                console.log(error)
                return null
              }
              if (loading) return 'Searching for Games...'
              if (!data || !data.games || !data.games.length) {
                return <li className='p-2 text-red-500'>
                  No games available right now.
                  <br />
                  <Link to='/new-game' className='text-purple-500'>Create a Game</Link>
                  &nbsp;and invite a friend!
                </li>
              }

              return (<>
                {data.games
                  .map(game => <li
                    to={`/game/${game.id}`}
                    className='p-3 m-1 flex justify-between items-center border rounded-lg'
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
        </ul>
        <Chat />
      </>}
    </>}
  </ApolloConsumer>
}
