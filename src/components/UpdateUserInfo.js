import React, { useMemo } from 'react'
import { Query, Mutation } from 'react-apollo'
import { USER, UPDATE_USER } from '../queries'

export const UpdateUserInfo = ({ user }) => {
  if (user) {
    return <Query query={USER} variables={{ userId: user.sub }} fetchPolicy='no-cache'>
      {({ loading, error, data }) => {
        if (error) {
          console.log(error)
        }

        if (data && data.users_by_pk && (!data.users_by_pk.avatar || !data.users_by_pk.name)) {
          return <Mutation mutation={UPDATE_USER} variables={{
            userId: user.sub,
            avatar: data.users_by_pk.avatar || user.picture,
            name: data.users_by_pk.name || user.name || user.nickname || user.given_name || user.email || 'No Name'
          }}>
            {(updateUser, { loading, error, data, called }) => {
              if (error) {
                console.log(error)
              }

              if (!called) {
                updateUser()
              }

              return null
            }}
          </Mutation>
        }

        return null
      }}
    </Query>
  }

  return null
}