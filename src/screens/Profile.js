import React from 'react'
import { useAuth0 } from '../auth/Auth'

export const Profile = props => {
  const { loading, user } = useAuth0()

  if (loading) return 'Loading...'

  return <main>
    <ul>
      {Object.keys(user).map(key => <li key={key}><code>{JSON.stringify({ [key]: user[key] }, null, 2)}</code></li>)}
    </ul>
  </main>
}
