'use server'

import { ChatResponse } from '@/@types/chat'
import { Character } from '@/@types/waifu-chat'
import fetchBase from '@/lib/fetch-base'

export async function findCharacterByName(characterName: string) {
  if (!characterName || characterName.trim() === '') return null

  const response = await fetchBase<Character>({
    method: 'GET',
    endpoint: `/openai/character-chatbot/lookup?character_name=${characterName}`,
    noCache: true
  })

  if (!response) return null

  return response
}

export async function startChat(characterSlug: string) {
  if (!characterSlug || characterSlug.trim() === '') return null

  const response = await fetchBase<ChatResponse>({
    method: 'GET',
    endpoint: `/openai/character-chatbot/${characterSlug}/start`,
    noCache: true
  })

  if (!response) return null

  return response
}

export async function getCharacterInfo(characterSlug: string) {
  const response = await fetchBase<Character>({
    method: 'GET',
    endpoint: `/openai/character-chatbot/${characterSlug}`,
    noCache: true
  })

  if (!response) return null

  return response
}
