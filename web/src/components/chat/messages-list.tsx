'use client'

import { ChatResponse } from '@/@types/chat'
import { cn } from '@/lib/utils'
import { parseMarkdown } from '@/utils/array'
import { cva } from 'class-variance-authority'
import { useEffect, useState } from 'react'

type Props = {
  messagesHistory: ChatResponse[]
}

const messageBlockVariants = cva('break-word max-w-[80%]', {
  variants: {
    type: {
      human: 'bg-gray-200 p-2 rounded-lg self-end',
      ai: 'bg-gray-300 p-2 rounded-lg self-start',
      tool: 'self-start font-medium italic opacity-40 text-sm'
    }
  },
  defaultVariants: {
    type: 'human'
  }
})

function MessageBlock({ message }: { message: ChatResponse }) {
  const [parsedMessage, setParsedMessage] = useState<string | null>(null)

  const handleParseMessage = async () => {
    const htmlContent = await parseMarkdown(message.content)
    setParsedMessage(htmlContent)
  }

  useEffect(() => {
    handleParseMessage()
  }, [message])

  return (
    <div className={cn(messageBlockVariants({ type: message.type }))}>
      <div dangerouslySetInnerHTML={{ __html: parsedMessage ?? message.content }} />
    </div>
  )
}

export default function MessagesList({ messagesHistory }: Props) {
  if (!messagesHistory.length) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="font-medium italic opacity-40">No messages yet</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {messagesHistory.map((message, index) => (
        <MessageBlock key={`${message.id}-${index}`} message={message} />
      ))}
    </div>
  )
}
