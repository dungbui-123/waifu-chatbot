'use client'

import { Thread } from '@/@types/thread'
import { useGetThreadsQuery } from '@/data/thread'
import useGlobalContext from '@/hooks/use-global-context'
import Link from 'next/link'

type ThreadItemProps = {
  threadId: string
  threadName: string
  onItemClicked?: () => void
}

function ThreadItem({ threadId, threadName, onItemClicked }: ThreadItemProps) {
  const handleClick = () => {
    if (typeof onItemClicked === 'function') onItemClicked()
  }

  return (
    <Link
      href={`/${threadId}`}
      onClick={handleClick}
      className="block text-xl transition-all duration-200 hover:translate-x-[8px] hover:underline"
    >
      {threadName}
    </Link>
  )
}

function ThreadListWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="absolute top-0 z-10 h-full w-full p-12 text-white">
      <h1 className="text-4xl font-medium">Histories</h1>

      {children}
    </div>
  )
}

type ThreadListContentProps = {
  threads: Thread[] | undefined
  isLoading?: boolean
  onItemClicked?: () => void
}

function ThreadListContent({ threads, isLoading = false, onItemClicked }: ThreadListContentProps) {
  if (!threads || threads.length === 0) {
    return (
      <p className="mt-4 text-center text-sm font-medium italic opacity-40">
        {isLoading ? 'Loading threads...' : 'No threads found'}
      </p>
    )
  }

  return (
    <div className="mt-4 space-y-1.5">
      {threads.map((thread) => (
        <ThreadItem key={thread.id} threadId={thread.id} threadName={thread.title} onItemClicked={onItemClicked} />
      ))}
    </div>
  )
}

export default function ThreadsList() {
  const { data: threads, isLoading } = useGetThreadsQuery()
  const { isOpenSidebar, toggle } = useGlobalContext()

  if (!isOpenSidebar) {
    return <></>
  }

  return (
    <ThreadListWrapper>
      <ThreadListContent threads={threads} isLoading={isLoading} onItemClicked={toggle} />
    </ThreadListWrapper>
  )
}
