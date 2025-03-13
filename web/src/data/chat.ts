import { SendChatRequest } from '@/@types/chat'
import { getChatByThreadId, sendChat } from '@/server/actions/chat'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useSendChatMutation = () =>
  useMutation({
    mutationKey: ['sendChat'],
    mutationFn: async (request: SendChatRequest) => await sendChat(request)
  })

export const useGetChatByThreadIdQuery = (threadId: string) =>
  useQuery({
    queryKey: ['getChatByThreadId'],
    queryFn: async () => getChatByThreadId(threadId)
  })
