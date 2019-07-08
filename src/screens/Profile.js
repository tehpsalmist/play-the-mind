import React from 'react'
import { useAuth0 } from '../auth/Auth'

export const Profile = props => {
  const { loading, user } = useAuth0()

  if (loading) return 'Loading...'

  return <main>
    <code>{JSON.stringify(user)}</code>
  </main>
}
