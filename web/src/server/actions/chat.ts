'use server'

import { ChatResponse, SendChatRequest } from '@/@types/chat'
import fetchBase from '@/lib/fetch-base'
import { parseMarkdown } from '@/utils/array'

export const sendChat = async (request: SendChatRequest) => {
  const response = await fetchBase<ChatResponse>({
    method: 'POST',
    endpoint: '/openai/chat',
    body: JSON.stringify(request)
  })

  if (!response) return null

  const parsedContent = await parseMarkdown(response.content)
  return {
    ...response,
    content: parsedContent
  }
}

export const getChatByThreadId = async (threadId: string) => {
  const response = await fetchBase<ChatResponse[]>({
    method: 'GET',
    endpoint: `/openai/chat/history?thread_id=${threadId}`,
    tags: ['chat'],
    noCache: true
  })

  return response
}
