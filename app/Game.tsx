'use client'

import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { z } from 'zod'

export default function Game() {
    return (
        <div className='flex h-full w-full flex-col overflow-hidden'>
            {/* Game Visuals Area */}
            <article className='flex w-full flex-1 flex-col gap-2 overflow-y-auto pb-12'>
                h
            </article>

            {/* Chat Input Area */}
            <section className='flex items-center justify-center '>
                <form
                    autoComplete='off'
                    className='m-2 flex h-16 w-[90%] max-w-4xl flex-row items-center border-2 border-black bg-white text-black shadow-[3px_3px_0_black]'
                >
                    <input
                        type='text'
                        name='userQuery'
                        className='h-full flex-1 flex-grow p-2 text-xl outline-none'
                        placeholder='Choose an action'
                    />
                </form>
            </section>
        </div>
    )
}
