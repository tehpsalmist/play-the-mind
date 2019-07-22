import React from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const SUGGESTING_STAR = gql`
  mutation toggle_player_suggesting_star_state($playerId: Int, $suggestingStar: Boolean) {
    update_players(where: {id: {_eq: $playerId}}, _set: {suggesting_star: $suggestingStar}) {
      affected_rows
    }
  }
`

export const StarButton = ({ player, game }) => {
  return <Mutation mutation={SUGGESTING_STAR} variables={{
    suggestingStar: !player.suggesting_star,
    playerId: player.id
  }}>
    {(toggleSuggestingStar, { error, called }) => {
      if (error) console.error(error)

      const bg = player.suggesting_star ? 'bg-purple-500' : 'bg-blue-500'

      return <button
        className={`absolute top-0 left-0 px-1 shadow-lg sm:p-3 ${bg} rounded text-white`}
        onClick={() => !game.in_conflict && game.stars && toggleSuggestingStar()}
      >
        {player.suggesting_star ? 'Withdraw Star Suggestion' : 'Let\'s throw a star!'}
      </button>
    }}
  </Mutation>
}
