'use client'

import React, { useRef, useState } from 'react'
import { Input } from '../ui/input'
import { useEventListener } from 'usehooks-ts'
import { ChatResponse } from '@/@types/chat'
import { removeDuplicateValues } from '@/utils/ array'
import useStreamMessage from '@/hooks/use-stream-message'

type Props = {
  currentThreadId: string
  messagesHistory: ChatResponse[]
  setMessagesHistory: React.Dispatch<React.SetStateAction<ChatResponse[]>>
}

export default function ChatInput({ currentThreadId, messagesHistory, setMessagesHistory }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string>('')
  const { handleRequest: sendChat, isLoading } = useStreamMessage({
    url: 'http://localhost:8000/api/v1/openai/chat/stream',
    setMessagesHistory
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value)
  }

  const handleSend = async () => {
    try {
      setMessage('')

      setMessagesHistory((prev) =>
        removeDuplicateValues([
          ...prev,
          { content: message, id: (messagesHistory.length + 1).toString(), thread_id: currentThreadId, type: 'human' }
        ])
      )

      await sendChat({
        messages: [message],
        thread_id: currentThreadId,
        action: currentThreadId === '' ? 'start' : 'send'
      })

      if (inputRef.current) inputRef.current.focus()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  // Listen 'Enter' key to send message
  useEventListener('keydown', async (e: KeyboardEvent) => {
    if (e.key === 'Enter' && message.trim() !== '') {
      await handleSend()
    }
  })

  return (
    <Input
      ref={inputRef}
      disabled={isLoading}
      placeholder={isLoading ? 'thinking ...' : 'something new... ?'}
      value={message}
      onChange={handleChange}
    />
  )
}
