import React, { useEffect, useState } from 'react'
import { Route } from 'react-router-dom'
import { useAuth0 } from './Auth'
import { PleaseLogin } from './PleaseLogin'

const PrivateRoute = ({ component: Component, path, ...rest }) => {
  const [authenticating, setAuthenticating] = useState(false)
  const { isAuthenticated, loginWithPopup, loading } = useAuth0()

  useEffect(() => {
    const fn = async () => {
      if (!isAuthenticated && !loading && !authenticating) {
        setAuthenticating(true)
        await loginWithPopup({})
        setAuthenticating(false)
      }
    }
    fn()
  }, [isAuthenticated, loginWithPopup, path])

  const render = isAuthenticated ? props => <Component {...props} /> : props => <PleaseLogin {...props} />

  return <Route path={path} render={render} {...rest} />
}

export default PrivateRoute
