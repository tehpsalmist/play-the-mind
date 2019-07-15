import React, { useState, useEffect, useContext } from 'react'
import createAuth0Client from '@auth0/auth0-spa-js'
import { withRouter } from 'react-router-dom'
import { useApolloClient } from '../hooks'
import gql from 'graphql-tag'

const TOKEN_QUERY = gql`
  query getAuthToken {
    authToken @client
  }
`

export const Auth0Context = React.createContext()
export const useAuth0 = () => useContext(Auth0Context)

export const Auth0Provider = withRouter(({
  children,
  history,
  match,
  ...initOptions
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState()
  const [user, setUser] = useState()
  const [authToken, setAuthToken] = useState('')
  const [authAppState, setAuthAppState] = useState()
  const [auth0Client, setAuth0] = useState()
  const [loading, setLoading] = useState(true)
  const [popupOpen, setPopupOpen] = useState(false)
  const [apolloClient, setApolloClient] = useApolloClient()

  const { authToken: cachedAuthToken } = apolloClient.readQuery({ query: TOKEN_QUERY })

  if (authToken !== cachedAuthToken) {
    apolloClient.stop()
    setApolloClient(authToken || '')
    if (authToken === null || authToken === undefined) {
      setAuthToken('')
    }
  }

  useEffect(() => {
    const initAuth0 = async () => {
      const auth0FromHook = await createAuth0Client(initOptions)
      setAuth0(auth0FromHook)

      if (window.location.search.includes('code=')) {
        const { appState } = await auth0FromHook.handleRedirectCallback()

        setAuthAppState(appState)

        await auth0FromHook.getTokenSilently()
      }

      const isAuthenticated = await auth0FromHook.isAuthenticated()

      setIsAuthenticated(isAuthenticated)

      if (isAuthenticated) {
        const [user, fetchedToken] = await Promise.all([auth0FromHook.getUser(), auth0FromHook.getTokenSilently()])

        setUser(user)
        setAuthToken(fetchedToken)
        window.localStorage.setItem('authToken', fetchedToken)
      }

      setLoading(false)
    }

    initAuth0()
    // eslint-disable-next-line
  }, []);

  const loginWithPopup = async (params = {}) => {
    if (!auth0Client) return

    setPopupOpen(true)

    try {
      await auth0Client.loginWithPopup(params)
    } catch (error) {
      console.error('popup error', error)
      setAuthToken('')
      window.localStorage.setItem('authToken', '')
      return setIsAuthenticated(false)
    }

    setPopupOpen(false)

    const [user, token] = await Promise.all([auth0Client.getUser(), auth0Client.getTokenSilently()])

    setAuthToken(token)
    window.localStorage.setItem('authToken', token)
    setUser(user)
    setIsAuthenticated(true)
  }

  const handleRedirectCallback = async () => {
    setLoading(true)

    const { appState } = await auth0Client.handleRedirectCallback()
    const [user, token] = await Promise.all([auth0Client.getUser(), auth0Client.getTokenSilently()])

    setLoading(false)
    setAuthToken(token)
    window.localStorage.setItem('authToken', token)
    setAuthAppState(appState)
    setIsAuthenticated(true)
    setUser(user)
  }

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        authToken,
        apolloClient,
        loading,
        popupOpen,
        loginWithPopup,
        handleRedirectCallback,
        authAppState,
        setAuthAppState,
        getIdTokenClaims: async (...p) => auth0Client && auth0Client.getIdTokenClaims(...p),
        loginWithRedirect: (...p) => auth0Client.loginWithRedirect(...p),
        getTokenSilently: async (...p) => auth0Client && auth0Client.getTokenSilently(...p),
        getTokenWithPopup: (...p) => auth0Client.getTokenWithPopup(...p),
        logout: (...p) => {
          window.localStorage.removeItem('authToken')
          auth0Client.logout(...p)
        }
      }}
    >
      {children}
    </Auth0Context.Provider>
  )
})
