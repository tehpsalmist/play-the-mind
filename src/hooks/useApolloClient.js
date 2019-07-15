import { useState } from 'react'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const cache = new InMemoryCache()
const initialToken = window.localStorage.getItem('authToken')

const createClient = token => {
  // Create an http link:
  const httpLink = new HttpLink({
    uri: 'https://the-mind.herokuapp.com/v1/graphql',
    headers: {
      Authorization: `Bearer ${token}`
    }
  })

  // Create a WebSocket link:
  const wsLink = new WebSocketLink({
    uri: `wss://the-mind.herokuapp.com/v1/graphql`,
    options: {
      reconnect: true,
      connectionParams: () => ({
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
      lazy: true
    }
  })

  // using the ability to split links, you can send data to each link
  // depending on what kind of operation is being sent
  const link = split(
    ({ query }) => {
      const definition = getMainDefinition(query)

      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      )
    },
    wsLink,
    httpLink
  )

  return new ApolloClient({
    link: link,
    cache,
    resolvers: {}
  })
}

const firstClient = createClient(initialToken)

firstClient.writeData({
  data: {
    authToken: initialToken
  }
})

export const useApolloClient = () => {
  const [client, setClient] = useState(firstClient)

  return [client, newToken => {
    const newClient = createClient(newToken)

    newClient.writeData({
      data: {
        authToken: newToken
      }
    })

    return setClient(newClient)
  }]
}
