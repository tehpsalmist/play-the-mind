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
      <nav className='bg-gray-800 shadow-lg text-gray-500 overflow-x-auto whitespace-no-wrap'>
        <NavLink activeClassName='text-white' className='py-2 px-4 sm:p-4 hover:bg-gray-700' exact to='/'>Home</NavLink>
        {isAuthenticated && <>
          <NavLink activeClassName='text-white' className='py-2 px-4 sm:p-4 hover:bg-gray-700' to='/new-game'>New Game</NavLink>
          <NavLink activeClassName='text-white' className='py-2 px-4 sm:p-4 hover:bg-gray-700' to='/profile'>Profile</NavLink>
          <button className='py-2 px-4 sm:p-4 hover:bg-gray-700' onClick={() => logout()}>Logout</button>
        </>}
        {!isAuthenticated && <button className='py-2 px-4 sm:p-4 hover:bg-gray-700' onClick={() => loginWithPopup({})}>Login</button>}
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
