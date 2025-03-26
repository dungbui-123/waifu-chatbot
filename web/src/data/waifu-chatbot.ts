import { findCharacterByName, startChat } from '@/server/actions/waifu-chat'
import { useMutation } from '@tanstack/react-query'

export const useFindCharacterByNameMutation = () =>
  useMutation({
    mutationKey: ['character'],
    mutationFn: async (name: string) => findCharacterByName(name)
  })

export const useStartChatMutation = () =>
  useMutation({
    mutationKey: ['chat'],
    mutationFn: async (slug: string) => startChat(slug)
  })
