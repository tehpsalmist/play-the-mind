import React from 'react'
import { useAuth0 } from '../auth/Auth'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const READY = gql`
  mutation toggle_player_ready_state($playerId: Int, $ready: Boolean) {
    update_players(where: {id: {_eq: $playerId}}, _set: {ready: $ready}) {
      affected_rows
    }
  }
`

const SUGGESTING_STAR = gql`
  mutation toggle_player_suggesting_star_state($playerId: Int, $suggestingStar: Boolean) {
    update_players(where: {id: {_eq: $playerId}}, _set: {suggesting_star: $suggestingStar}) {
      affected_rows
    }
  }
`

const PLAY_CARD = gql`
  mutation play_card($cards: _int2, $card: Int, $playerId: Int, $gameId: Int, $roundId: Int) {
    update_players(where: {id: {_eq: $playerId}}, _set: {cards: $cards, selected: null}) {
      affected_rows
    }
    insert_plays(objects: {player_id: $playerId, game_id: $gameId, round_id: $roundId, value: $card}) {
      affected_rows
    }
  }
`

export const GameBoard = ({ game, isOwner }) => {
  console.log(game)
  const { user } = useAuth0()
  const [player, ...partners] = game.players.sort((a, b) => a.user_id === user.sub ? -1 : b.user_id === user.sub ? 1 : 0)
  const [lastCard, ...cards] = game.plays.filter(play => play.round_id === game.round.id).map(({ value }) => value)

  return <main>
    <section style={{
      display: 'grid',
      height: '50%',
      gridTemplate: `1fr / repeat(${game.player_count}, 1fr)`
    }}>
      {
        game.players.map(p => <div key={p.id} className='flex items-center flex-col'>
          <p>{p.name}</p>
          {
            p.cards.map((card, i) => i === 0 && p.id === player.id
              ? <Mutation key={card} mutation={PLAY_CARD} variables={{
                gameId: game.id,
                playerId: player.id,
                roundId: game.round.id,
                card,
                cards: `{${p.cards.filter(c => c !== card).join(',')}}`
              }}>
                {(playCard, { error, loading, called }) => {
                  if (error) console.error(error)

                  return (!called || error) ? <button
                    className={`border-4 border-black p-3 rounded`}
                    onClick={() => !loading && game.ready && !game.in_conflict && playCard()}
                  >
                    {card}
                  </button> : null
                }}
              </Mutation>
              : <p key={card}>{card}</p>)
          }
          {p.id === player.id && <Mutation mutation={READY} variables={{
            ready: !player.ready,
            playerId: player.id
          }}>
            {(toggleReadyState, { error }) => {
              if (error) console.error(error)

              return <button
                className={`mt-auto p-3 ${player.ready ? 'bg-red-500' : 'bg-green-500'} rounded text-white`}
                onClick={() => toggleReadyState()}
              >
                {player.ready ? 'Declare Concentration' : 'Ready'}
              </button>
            }}
          </Mutation>}
          {p.id === player.id && <Mutation mutation={SUGGESTING_STAR} variables={{
            suggestingStar: !player.suggesting_star,
            playerId: player.id
          }}>
            {(toggleSuggestingStar, { error }) => {
              if (error) console.error(error)

              return <button
                className={`mt-2 p-3 ${player.suggesting_star ? 'bg-purple-500' : 'bg-blue-500'} rounded text-white`}
                onClick={() => !game.in_conflict && toggleSuggestingStar()}
              >
                {player.suggesting_star ? 'Withdraw Star Suggestion' : 'Let\'s throw a star!'}
              </button>
            }}
          </Mutation>}
        </div>)
      }
    </section>
    <section className='flex-center flex-col h-1/2'>
      <p className={`mb-10 ${game.ready ? 'text-green-500' : 'text-yellow-600'}`}>{game.ready ? 'Ready' : 'Paused'}</p>
      {game.in_conflict && <p className='text-red-600'>CONFLICT</p>}
      <h2 className='text-5xl'>{lastCard}</h2>
      <ul className='flex justify-center'>
        {cards.map(card => <li key={card} className='p-3 text-2xl'>{card}</li>)}
      </ul>
    </section>
  </main>
}
