'use client'

import { useEffect, useRef, useState } from 'react'
import ChatInput from './chat-input'
import { ScrollArea } from '../ui/scroll-area'
import { ChatResponse } from '@/@types/chat'
import MessagesList from './messages-list'
import SlideAnimate from '../slide-animate'

type Props = {
  currentThreadId: string
  chatHistory: ChatResponse[] | null
}

export default function ChatBox({ currentThreadId, chatHistory }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null)
  const [messagesHistory, setMessagesHistory] = useState<ChatResponse[]>(chatHistory ?? [])

  const handleScrollBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    handleScrollBottom()
  }, [messagesHistory])

  useEffect(() => {
    if (currentThreadId === '') {
      setMessagesHistory([])
    }
  }, [currentThreadId])

  return (
    <SlideAnimate>
      <div className="flex h-full w-full flex-col">
        <div className="h-0 shrink grow">
          <ScrollArea className="h-full w-full p-2">
            <MessagesList messagesHistory={messagesHistory} />

            <div ref={bottomRef}></div>
          </ScrollArea>
        </div>

        <ChatInput
          currentThreadId={currentThreadId}
          messagesHistory={messagesHistory}
          setMessagesHistory={setMessagesHistory}
        />
      </div>
    </SlideAnimate>
  )
}
