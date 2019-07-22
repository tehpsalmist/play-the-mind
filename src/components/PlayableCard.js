import React from 'react'
import { Mutation } from 'react-apollo'
import { Card } from '.'
import gql from 'graphql-tag'
import { AnimatingCard } from './AnimatingCard'

const PLAY_CARD = gql`
  mutation play_card($cards: _int2, $card: Int, $playerId: Int, $gameId: Int, $roundId: Int) {
    update_players(where: {id: {_eq: $playerId}}, _set: {cards: $cards, selected: null}) {
      returning {
        id
        cards
      }
    }
    insert_plays(objects: {player_id: $playerId, game_id: $gameId, round_id: $roundId, value: $card}) {
      affected_rows
    }
  }
`

export const PlayableCard = ({ value, game, player, styles, classes, rotation, shiftX, shiftY }) => {
  return <Mutation mutation={PLAY_CARD} variables={{
    gameId: game.id,
    playerId: player.id,
    roundId: game.round.id,
    card: value,
    cards: `{${player.cards.filter(c => c !== value).join(',')}}`
  }}>
    {(playCard, { error, loading, called }) => {
      if (error) console.error(error)

      return (!called)
        ? <Card
          styles={{ ...styles, transform: `rotate(${rotation}deg) translateX(${shiftX}px) translateY(${shiftY}px)` }}
          classes={`border-green-400 ${classes}`}
          value={value}
          onClick={e => !loading && game.ready && !game.in_conflict && playCard()}
        />
        : <AnimatingCard
          styles={styles}
          classes={classes}
          value={value}
          x={shiftX}
          y={shiftY}
          rotation={rotation}
        />
    }}
  </Mutation>
}
