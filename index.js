import React from 'react'
import ReactDOM from 'react-dom'
import App from './src/App'
import { Auth0Provider } from './src/auth/Auth'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
  <BrowserRouter>
    <Auth0Provider
      domain='the-mind.auth0.com'
      client_id='qHjvQQhP1PoVG9MsOHMN9urv4WRcILdC'
      redirect_uri={window.location.origin}
    >
      <App />
    </Auth0Provider>
  </BrowserRouter>,
  document.getElementById('app')
)
