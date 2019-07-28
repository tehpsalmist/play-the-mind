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
      players(order_by: {joined_at: asc}) {
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

export const GLOBAL_MESSAGES = gql`
  subscription messages {
    messages(where: {game_id: {_is_null: true}}, order_by: {created_at: desc}) {
      text
      user {
        name
        avatar
      }
      id
      created_at
    }
  }
`

export const MESSAGES = gql`
  subscription messages($gameId: Int) {
    messages(where: {game_id: {_eq: $gameId}}, order_by: {created_at: desc}) {
      text
      user {
        name
        avatar
      }
      id
      created_at
    }
  }
`

export const SEND_MESSAGE = gql`
  mutation sendMessage($gameId: Int, $text: String, $userId: String) {
    insert_messages(objects: {game_id: $gameId, text: $text, user_id: $userId}) {
      affected_rows
    }
  }
`

export const USER = gql`
  query user($userId: String!) {
    users_by_pk(id: $userId) {
      id
      name
      avatar
    }
  }
`

export const UPDATE_USER = gql`
  mutation updateUser($userId: String, $name: String, $avatar: String) {
    update_users(where: {id: {_eq: $userId}}, _set: {avatar: $avatar, name: $name}) {
      affected_rows
    }
  }
`
