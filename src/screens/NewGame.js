import React, { useState } from 'react'
import gql from 'graphql-tag'
import { withApollo } from 'react-apollo'
import { withRouter } from 'react-router-dom'
import { useAuth0 } from '../auth/Auth'

export const NewGame = withRouter(withApollo(({ client, history }) => {
  const [players, setPlayers] = useState(null)
  const [gameName, setGameName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const { idToken } = useAuth0()

  const createGame = async (count, name) => {
    const variables = { name, count }

    const mutation = gql`
      mutation insert_games($count: Int, $name: String) {
        insert_games(objects: {player_count: $count, name: $name, lives: $count}) {
          returning {
            id
          }
        }
      }
    `

    const result = await client.mutate({
      mutation,
      variables,
      context: {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    }).catch(err => err instanceof Error ? err : new Error(JSON.stringify(err)))

    if (result instanceof Error) {
      console.error(result)
      setErrorMessage(`There was a problem creating the game: ${result.message}`)
      return result
    }

    const gameId = result.data.insert_games.returning[0].id

    history.push(`/game/${gameId}`)
  }

  return <main className='flex-center flex-col'>
    <label className='text-xl my-2'>Name Your Game</label>
    <input
      className='text-2xl my-2 border rounded border-blue-600'
      value={gameName}
      onChange={e => {
        setGameName(e.target.value)
        setErrorMessage('')
      }}
    />
    <label className='text-xl my-2'>Number of Players</label>
    <div className='flex justify-around w-full sm:w-2/3 md:w-1/3 lg:w-1/5 text-white text-3xl my-2'>
      <button
        className={`flex-center w-16 h-16 rounded ${players === 2 ? 'bg-green-500' : 'bg-blue-500'}`}
        onClick={() => {
          setPlayers(2)
          setErrorMessage('')
        }}
      >
        2
      </button>
      <button
        className={`flex-center w-16 h-16 rounded ${players === 3 ? 'bg-green-500' : 'bg-blue-500'}`}
        onClick={() => {
          setPlayers(3)
          setErrorMessage('')
        }}
      >
        3
      </button>
      <button
        className={`flex-center w-16 h-16 rounded ${players === 4 ? 'bg-green-500' : 'bg-blue-500'}`}
        onClick={() => {
          setPlayers(4)
          setErrorMessage('')
        }}
      >
        4
      </button>
    </div>
    <button
      className={`${players && gameName ? 'bg-green-500' : 'bg-gray-600'} p-6 rounded text-white text-3xl my-2`}
      onClick={() => players && gameName && createGame(players, gameName)}
    >
      Create Game
    </button>
    {errorMessage && <p className='text-red-600 my-2'>{errorMessage}</p>}
  </main>
}))
