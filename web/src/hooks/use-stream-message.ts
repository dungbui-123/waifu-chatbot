'use client'

import { ChatResponse, SendChatRequest } from '@/@types/chat'
import { parseMarkdown, removeDuplicateValues } from '@/utils/ array'
import { useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import useInvalidateTag from './use-invalidate-tag'

type Props = {
  url: string
  setMessagesHistory: React.Dispatch<React.SetStateAction<ChatResponse[]>>
}

export default function useStreamMessage({ url, setMessagesHistory }: Props) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const router = useRouter()
  const pathname = usePathname()
  const { invalidateTag } = useInvalidateTag()

  const handleRequest = async (body: SendChatRequest) => {
    try {
      setIsLoading(true)

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })
      const reader = response.body?.getReader()

      if (!reader) return

      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })

        const receivedContent = JSON.parse(chunk) as ChatResponse

        // Redirect to the thread page if this is new thread
        if (receivedContent.thread_id && pathname === '/') {
          invalidateTag(['threads'])
          router.push(`/${receivedContent.thread_id}`)
          return true
        }

        const parsedContent = await parseMarkdown(receivedContent.content)

        setMessagesHistory((prev) =>
          removeDuplicateValues([
            ...prev,
            {
              ...receivedContent,
              content: parsedContent
            }
          ])
        )
      }

      return true
    } catch (error) {
      console.error('Error fetching stream:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    handleRequest
  }
}
