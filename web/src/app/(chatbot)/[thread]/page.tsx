import ChatBox from '@/components/chat/chat-box'
import ThreadsList from '@/components/chat/threads-list'
import ToolBox from '@/components/chat/tool-box'
import Underlay from '@/components/underlay'
import { getChatByThreadId } from '@/server/actions/chat'
import { getThreadById } from '@/server/actions/thread'

type Props = {
  params: {
    thread: string
  }
}

export default async function index({ params }: Props) {
  const { thread: threadId } = await params

  const chatHistory = await getChatByThreadId(threadId)

  const threadData = await getThreadById(threadId)

  return (
    <>
      <ToolBox currentThread={threadData} />

      <ChatBox currentThreadId={threadId} chatHistory={chatHistory} />

      <ThreadsList />

      <Underlay />
    </>
  )
}
