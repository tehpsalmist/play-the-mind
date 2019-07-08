import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, NavLink } from 'react-router-dom'
import { NewGame, Lobby, Game, Profile } from './screens'
import ApolloClient from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { ApolloProvider } from 'react-apollo'
import { split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'
import { useAuth0 } from './auth/Auth'
import PrivateRoute from './auth/PrivateRoute'

// Create an http link:
const httpLink = new HttpLink({
  uri: 'https://the-mind.herokuapp.com/v1/graphql'
})

const initialToken = window.localStorage.getItem('idToken')
// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: `wss://the-mind.herokuapp.com/v1/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      headers: {
        Authorization: `Bearer ${initialToken}`
      }
    }
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

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache()
})

export const changeSubscriptionToken = async token => {
  const params = await wsLink.subscriptionClient.connectionParams()

  if (params.headers.Authorization === `Bearer ${token}`) {
    return
  }

  params.headers.Authorization = `Bearer ${token}`

  wsLink.subscriptionClient.close()
  wsLink.subscriptionClient.connect()
}

export default props => {
  const { isAuthenticated, loginWithPopup, logout, idToken } = useAuth0()

  useEffect(() => {
    changeSubscriptionToken(idToken)
  }, [idToken])

  return <ApolloProvider client={client}>
    <Router>
      <nav className='flex bg-gray-800 text-gray-500 items-center'>
        <NavLink activeClassName='text-white' className='p-4 hover:bg-gray-700' exact to='/'>Home</NavLink>
        {isAuthenticated && <>
          <NavLink activeClassName='text-white' className='p-4 hover:bg-gray-700' to='/new-game'>New Game</NavLink>
          <NavLink className='p-4 hover:bg-gray-700' to='/profile'>Profile</NavLink>
          <button className='p-4 hover:bg-gray-700' onClick={() => logout()}>Logout</button>
        </>}
        {!isAuthenticated && <button className='p-4 hover:bg-gray-700' onClick={() => loginWithPopup({})}>Login</button>}
      </nav>
      <Switch>
        <PrivateRoute path='/new-game' component={NewGame} />
        <PrivateRoute path='/profile' component={Profile} />
        <PrivateRoute path='/game/:id' component={Game} />
        <Route exact path='/' component={Lobby} />
      </Switch>
    </Router>
  </ApolloProvider>
}
