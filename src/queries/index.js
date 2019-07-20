import gql from 'graphql-tag'

export const GAME = gql`
  subscription games_by_pk($gameId: Int!) {
    games_by_pk(id: $gameId) {
      id
      name
      is_full
      lives
      stars
      started
      ready
      in_conflict
      transitioning_round
      finished
      player_count
      players {
        id
        name
        user_id
        suggesting_star
        cards
        ready
        revealed_cards(order_by: {timestamp: desc, round_id: desc}) {
          id
          round_id
          timestamp
          value
        }
      }
      round {
        id
        number_of_cards
        is_blind
        name
        reward
      }
      plays(order_by: {timestamp: desc, round_id: desc}) {
        id
        player_id
        reconciled
        round_id
        round {
          name
        }
        player {
          name
        }
        timestamp
        value
      }
      finished_at
      created_at
      owner_id
    }
  }
`
