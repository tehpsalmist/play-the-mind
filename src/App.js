import React from 'react'
import { BrowserRouter as Router, Switch, Route, NavLink, withRouter } from 'react-router-dom'
import { NewGame, Lobby, Game, Profile } from './screens'
import { ApolloProvider } from 'react-apollo'
import { useAuth0 } from './auth/Auth'
import PrivateRoute from './auth/PrivateRoute'

export default props => {
  const { isAuthenticated, loginWithPopup, logout, apolloClient } = useAuth0()

  return <ApolloProvider client={apolloClient}>
    <Router>
      <nav className='flex bg-gray-800 text-gray-500 items-center'>
        <NavLink activeClassName='text-white' className='p-4 hover:bg-gray-700' exact to='/'>Home</NavLink>
        {isAuthenticated && <>
          <NavLink activeClassName='text-white' className='p-4 hover:bg-gray-700' to='/new-game'>New Game</NavLink>
          <NavLink activeClassName='text-white' className='p-4 hover:bg-gray-700' to='/profile'>Profile</NavLink>
          <button className='p-4 hover:bg-gray-700' onClick={() => logout()}>Logout</button>
        </>}
        {!isAuthenticated && <button className='p-4 hover:bg-gray-700' onClick={() => loginWithPopup({})}>Login</button>}
      </nav>
      <Switch>
        <PrivateRoute path='/new-game' component={withRouter(NewGame)} />
        <PrivateRoute path='/profile' component={withRouter(Profile)} />
        <PrivateRoute path='/game/:id' component={withRouter(Game)} />
        <Route exact path='/' component={withRouter(Lobby)} />
      </Switch>
    </Router>
  </ApolloProvider>
}
