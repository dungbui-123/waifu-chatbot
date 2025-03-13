'use server'

import { Thread } from '@/@types/thread'
import fetchBase from '@/lib/fetch-base'
import { revalidateTag } from 'next/cache'

export async function getThreads() {
  const response = await fetchBase<Thread[]>({
    method: 'GET',
    endpoint: '/openai/thread',
    noCache: true
  })

  revalidateTag('chat')

  if (!response) return []

  return response
}

export async function getThreadById(threadId: string) {
  if (!threadId || threadId.trim() === '') return null

  const response = await fetchBase<Thread>({
    method: 'GET',
    endpoint: `/openai/thread/${threadId}`,
    noCache: true
  })

  if (!response) return null

  return response
}

export async function deleteThreadById(threadId: string) {
  if (!threadId || threadId.trim() === '') return null

  const response = await fetchBase<Thread>({
    method: 'DELETE',
    endpoint: `/openai/thread/${threadId}`
  })

  if (!response) return null

  return response
}
