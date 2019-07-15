import React from 'react'
import gql from 'graphql-tag'
import { Mutation } from 'react-apollo'
import { useAuth0 } from '../auth/Auth'

const LEAVE_GAME = gql`
  mutation delete_players($playerId: Int) {
    delete_players(where: {id: {_eq: $playerId}}) {
      affected_rows
    }
  }
`

const JOIN_GAME = gql`
  mutation insert_players($gameId: Int, $name: String) {
    insert_players(objects: {game_id: $gameId, name: $name, cards: "{}"}) {
      returning {
        id
        game {
          id
        }
      }
    }
  }
`

export const GamePrepGuest = ({ game }) => {
  const { user } = useAuth0()
  const me = game.players.find(p => p.user_id === user.sub)

  return <main className='h-screen flex-center flex-col'>
    {
      game.is_full
        ? <>
          <p className='mb-2'>All players have joined ({game.players.length}/{game.player_count}).</p>
          <p>Your host will start the game momentarily.</p>
        </>
        : <>
          <p className='mb-2'>Waiting for remaining players to join ({game.players.length}/{game.player_count}).</p>
          <p>Your host can start the game when all players have joined.</p>
        </>
    }
    <p className='my-2'>Your Mind Mates:</p>
    <ul>
      {game.players.map(player => <li key={player.id}>
        <strong>{player.name}</strong>
        {player.user_id === game.owner_id && ' (Game Host)'}
      </li>)}
    </ul>
    {
      me
        ? <Mutation mutation={LEAVE_GAME}>
          {(leaveGame, { loading, data, error, called }) => {
            if (called && data) {
              console.log(data)
            }

            return <button
              className={`p-2 my-2 ${loading ? 'bg-gray-600' : 'bg-orange-500'} text-white rounded`}
              onClick={e => {
                e.preventDefault()

                !loading && leaveGame({
                  variables: { playerId: me.id }
                })
              }}
            >
              Leave
            </button>
          }}
        </Mutation>
        : <Mutation mutation={JOIN_GAME}>
          {(joinGame, { loading, data, error, called }) => {
            return <button
              className={`p-2 my-2 ${loading ? 'bg-gray-600' : 'bg-green-500'} text-white rounded`}
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
    }
  </main>
}
