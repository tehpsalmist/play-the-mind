import React, { useState, useRef, useLayoutEffect } from 'react'
import { Subscription, Mutation } from 'react-apollo'
import { MESSAGES, GLOBAL_MESSAGES, SEND_MESSAGE } from '../queries'
import { useAuth0 } from '../auth/Auth'

export const Chat = ({ game }) => {
  const { user } = useAuth0()
  const [newMessage, setNewMessage] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef()

  const focusElement = (elRef, isOpen) => {
    if (isOpen && elRef && elRef.current) {
      elRef.current.focus()
    }
  }

  useLayoutEffect(() => {
    if (open) {
      ref.current.focus()
    }
  }, [open])

  return <aside className='fixed bottom-0 right-0 bg-white shadow-lg p-1 sm:mb-2 sm:mr-2 z-50 w-full sm:w-80 max-h-1/2 sm:max-h-2/5 flex flex-col items-stretch'>
    <Subscription subscription={game ? MESSAGES : GLOBAL_MESSAGES} variables={game ? { gameId: game.id } : {}} shouldResubscribe>
      {({ loading, error, data }) => {
        if (loading) return 'Loading Messages...'
        if (error) return `Error Loading Messages: ${error.message}`
        if (!data || !data.messages || !data.messages.length) {
          return <a onClick={e => setOpen(!open)} className='text-gray-400 cursor-pointer'>Send a message...</a>
        }

        return open
          ? <>
            <button
              className='absolute top-0 right-0 ml-auto mr-1 text-3xl text-blue-500 leading-none px-2'
              onClick={e => setOpen(false)}
            >
              &#x2715;
            </button>
            <ul className='flex flex-col-reverse overflow-y-auto'>
              {data.messages.map(message => <li key={message.id}><strong>{message.user.name}:</strong>{' '}{message.text}</li>)}
            </ul>
          </>
          : <a onClick={e => setOpen(true)} className='text-gray-400 cursor-pointer truncate'>
            {data.messages[0]
              ? <><strong>{data.messages[0].user.name}:</strong>{' '}{data.messages[0].text}</>
              : 'Send a message...'}
          </a>
      }}
    </Subscription>

    {open
      ? <Mutation mutation={SEND_MESSAGE} variables={{
        gameId: game ? game.id : null,
        userId: user.sub,
        text: newMessage
      }}>
        {(sendMessage, { loading, error, data }) => {
          return <div className='relative'>
            <input
              ref={ref}
              className='border border-blue-300 rounded p-2 pr-8 w-full'
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyPress={e => {
                if (e.charCode === 13 && newMessage) {
                  sendMessage()
                  setNewMessage('')
                }
              }}
            />
            {newMessage && <button
              className='absolute bottom-0 right-0 mr-1 text-green-400 text-3xl'
              onClick={e => {
                sendMessage()
                setNewMessage('')
                focusElement(ref, open)
              }}
            >
              &#x27A4;
            </button>}
          </div>
        }}
      </Mutation>
      : null}
  </aside>
}