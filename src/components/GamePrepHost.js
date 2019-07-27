import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { Chat } from '.'

const START_GAME = gql`
  mutation start_game($gameId: Int) {
    update_games(where: {id: {_eq: $gameId}}, _set: {started: true}) {
      affected_rows
    }
  }
`

export const GamePrepHost = ({ game }) => {
  return <main className='h-screen flex-center flex-col'>
    {
      game.is_full
        ? <>
          <p className='mb-2'>All players have joined ({game.players.length}/{game.player_count}).</p>
          <Mutation mutation={START_GAME}>
            {(startGame, { loading, data, error, called }) => {
              return <button
                className={`text-2xl p-4 ${loading ? 'bg-gray-600' : 'bg-green-500'} text-white rounded`}
                onClick={e => {
                  e.preventDefault()

                  !loading && startGame({
                    variables: { gameId: game.id }
                  })
                }}
              >
                Start the Game
              </button>
            }}
          </Mutation>
        </>
        : <>
          <p>Waiting for remaining players to join ({game.players.length}/{game.player_count}).</p>
          <p className='my-2'>You can start the game when all players have joined.</p>
        </>
    }
    <p className='my-2'>Your Mind Mates:</p>
    <ul>
      {game.players.map(player => <li key={player.id}>
        <strong>{player.name}</strong>
        {player.user_id === game.owner_id && ' (Game Host)'}
      </li>)}
    </ul>
    <Chat game={game} />
  </main>
}
