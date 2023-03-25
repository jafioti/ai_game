'use client'
import Image from 'next/image'

import { useMutation } from '@tanstack/react-query'
import { useState, useRef } from 'react'
import { z } from 'zod'
/*
const { initial_description, history } = z
    .object({
      initial_description: z.string(),
      history: z.array(z.object({
        content: z.string(),
        role: z.string()
      })),
    })
*/

// 'Sci-fi opera featuring Kirby from Nintendo starting a Butlerian Jihad'

// console.log(process.env.NEXT_PUBLIC_ELEVEN_KEY)

type Message = {
  content: string
  role: 'user' | 'assistant' | 'system'
}

export default function Game() {
  const [initialDescription, setInitialDescription] = useState<string>()
  const [gameHistory, setGameHistory] = useState<Message[]>([])
  const [currentGameResponse, setCurrentGameResponse] = useState<string>()

  // Track the current query
  const [currentUserQuery, setCurrentUserQuery] = useState('')
  const [lastUserQuery, setLastUserQuery] = useState<string>()
  const [loading, setLoading] = useState(false);
  const [loadingImage, setLoadingImage] = useState(false);

  const [currentImage, setCurrentImage] = useState<string>()

  // Action suggestion
  const actionSuggestion =
    typeof initialDescription === 'undefined'
      ? 'What kind of game would you like to play?'
      : 'Type an action'

  // Quick mutation
  const sendQueryMutation = useMutation({
    mutationFn: async () => {
      // Clear out the current user query
      setCurrentUserQuery('')

      // Get the query string
      const query = currentUserQuery.trim()

      // Bail if string is empty
      if (query.length === 0) return

      if (typeof initialDescription === 'undefined') {
        setInitialDescription(query)
        return
      }

      setLastUserQuery(query)

      const message: Message = {
        content: query,
        role: 'user',
      }

      const history = [...gameHistory, message]

      setLoading(true);
      setLoadingImage(false);

      // Send query to API
      const rawResponse = await fetch('/api/query', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          initial_description: initialDescription,
          history: history,
        }),
      })

      // Get the response
      const response = z.string().parse(await rawResponse.text())

      setCurrentGameResponse(response)

      // Update history
      setGameHistory([
        ...history,
        {
          role: 'assistant',
          content: response,
        },
      ])

      setLoading(false);
      setLoadingImage(true);

      const imageURL = await fetch('/api/image', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: response,
        }),
      })
      const parsedImageURL = z.string().parse(await imageURL.text())

      setCurrentImage(parsedImageURL)
      setLoadingImage(false);
    },
  })

  return (
    <>
      <div className='flex h-full w-full flex-col overflow-hidden'>
        {initialDescription && <div className="my-5 text-2xl font-light mx-auto"><strong className='mr-1'>Premise: </strong>{initialDescription}</div>}

        {/* Game Visuals Area */}
        <article className='flex w-full flex-1 flex-col gap-2 overflow-y-auto pb-12'>
          <div className='m-16 flex flex-row gap-4'>
            <div className='flex-1'>
              {lastUserQuery && (
                <div className='p-4 border-2 border-blue-500'>
                  {lastUserQuery}
                </div>
              )}

              {currentGameResponse && (
                <div className='p-4 mt-4 border-2 border-black'>
                  {currentGameResponse}
                </div>
              )}
            </div>

            <div className='flex-1'>
              {currentImage && (
                <Image
                  src={currentImage}
                  alt='Generated Image'
                  className='object-scale-down w-96 rounded-lg'
                  width={768}
                  height={768}
                />
              )}
            </div>
          </div>
        </article>

        {loading && <div className='m-auto my-5'>Loading...</div>}
        {loadingImage && <div className='m-auto my-5'>Loading Image...</div>}

        {/* Chat Input Area */}
        <section className='flex items-center justify-center '>
          <form
            autoComplete='off'
            onSubmit={(event) => {
              event.preventDefault()

              // Send the query to the backend
              sendQueryMutation.mutate()
            }}
            className='m-2 flex h-16 w-[90%] max-w-4xl flex-row items-center border-2 border-black bg-white text-black shadow-[3px_3px_0_black]'
          >
            <input
              type='text'
              name='userQuery'
              className='h-full flex-1 flex-grow p-2 text-xl outline-none'
              placeholder={actionSuggestion}
              value={currentUserQuery}
              onChange={(e) =>
                setCurrentUserQuery(e.currentTarget.value)
              }
            />
          </form>
        </section>
      </div >
    </>
  )
}
