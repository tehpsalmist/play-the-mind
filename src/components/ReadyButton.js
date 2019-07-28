import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const READY = gql`
  mutation toggle_player_ready_state($playerId: Int, $ready: Boolean) {
    update_players(where: {id: {_eq: $playerId}}, _set: {ready: $ready}) {
      affected_rows
    }
  }
`

export const ReadyButton = ({ player }) => {
  return <Mutation mutation={READY} variables={{
    ready: !player.ready,
    playerId: player.id
  }}>
    {(toggleReadyState, { error, called }) => {
      if (error) console.error(error)

      const bg = player.ready ? 'bg-purple-500' : 'bg-purple-500'

      return <button
        className={`w-auto px-1 shadow-md sm:p-3 ${bg} rounded text-white`}
        onClick={() => toggleReadyState()}
      >
        {player.ready ? 'Let\'s Concentrate' : 'Ok, I\'m Ready!'}
      </button>
    }}
  </Mutation>
}
