'use client'

import { GlobalContextProvider } from '@/contexts/global-context'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from './ui/sonner'

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 15, // 15 minutes
            refetchOnWindowFocus: true,
            refetchInterval: 60 * 1000 * 10 // 10 minute
          }
        }
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalContextProvider>
        {children}

        <Toaster position="top-center" />
      </GlobalContextProvider>
    </QueryClientProvider>
  )
}
