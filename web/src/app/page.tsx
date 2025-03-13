import ChatBox from '@/components/chat/chat-box'
import ThreadsList from '@/components/chat/threads-list'
import ToolBox from '@/components/chat/tool-box'
import Underlay from '@/components/underlay'

export default async function Home() {
  return (
    <>
      <ToolBox currentThread={null} />

      <ChatBox currentThreadId={''} chatHistory={[]} />

      <ThreadsList />

      <Underlay />
    </>
  )
}
