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

      const bg = player.suggesting_star ? 'bg-red-500' : 'bg-blue-500'

      return <button
        className={`w-auto px-1 shadow-md sm:p-3 ${bg} rounded text-white`}
        onClick={() => !game.in_conflict && game.stars && toggleSuggestingStar()}
      >
        {player.suggesting_star
          ? <span>Cancel Star<span className='star-throbber'>&nbsp;&#x272F;</span></span>
          : 'Let\'s throw a star!'}
      </button>
    }}
  </Mutation>
}
