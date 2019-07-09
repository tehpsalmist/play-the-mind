import React, { useState, useEffect, useContext } from 'react'
import createAuth0Client from '@auth0/auth0-spa-js'
import { withRouter } from 'react-router-dom'
import { useApolloClient } from '../hooks'
import gql from 'graphql-tag'

const TOKEN_QUERY = gql`
  query getIdToken {
    idToken @client
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
  const [idToken, setIdToken] = useState('')
  const [authAppState, setAuthAppState] = useState()
  const [auth0Client, setAuth0] = useState()
  const [loading, setLoading] = useState(true)
  const [popupOpen, setPopupOpen] = useState(false)
  const [apolloClient, setApolloClient] = useApolloClient()

  const { idToken: cachedIdToken } = apolloClient.readQuery({ query: TOKEN_QUERY })

  if (idToken !== cachedIdToken) {
    apolloClient.clearStore()
    apolloClient.stop()
    setApolloClient(idToken)
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
        const [user, fetchedToken] = await Promise.all([auth0FromHook.getUser(), auth0FromHook.getIdToken()])

        setUser(user)
        setIdToken(fetchedToken)
        window.localStorage.setItem('idToken', fetchedToken)
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
    } finally {
      setPopupOpen(false)
    }

    const [user, token] = await Promise.all([auth0Client.getUser(), auth0Client.getIdToken()])

    setIdToken(token)
    window.localStorage.setItem('idToken', token)
    setUser(user)
    setIsAuthenticated(true)
  }

  const handleRedirectCallback = async () => {
    setLoading(true)

    const { appState } = await auth0Client.handleRedirectCallback()
    const [user, token] = await Promise.all([auth0Client.getUser(), auth0Client.getIdToken()])

    setLoading(false)
    setIdToken(token)
    window.localStorage.setItem('idToken', token)
    setAuthAppState(appState)
    setIsAuthenticated(true)
    setUser(user)
  }

  return (
    <Auth0Context.Provider
      value={{
        isAuthenticated,
        user,
        idToken,
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
          window.localStorage.removeItem('idToken')
          auth0Client.logout(...p)
        }
      }}
    >
      {children}
    </Auth0Context.Provider>
  )
})
