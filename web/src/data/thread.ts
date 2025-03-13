import { deleteThreadById, getThreads } from '@/server/actions/thread'
import { useMutation, useQuery } from '@tanstack/react-query'

export const useGetThreadsQuery = () =>
  useQuery({
    queryKey: ['threads'],
    queryFn: async () => getThreads()
  })

export const useDeleteThreadByIdMutation = () =>
  useMutation({
    mutationKey: ['deleteThreadById'],
    mutationFn: async (threadId: string) => deleteThreadById(threadId)
  })
