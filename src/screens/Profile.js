import React from 'react'
import { useAuth0 } from '../auth/Auth'
import { Chat } from '../components';

export const Profile = props => {
  const { loading, user } = useAuth0()

  if (loading) return 'Loading...'

  return <main className='flex-center flex-col h-screen'>
    <img className='rounded' src={user.picture} />
    <h2 className='text-3xl'>Name: {user.name || user.nickname || user.given_name || user.email || 'No Name'}</h2>
    <Chat />
  </main>
}
