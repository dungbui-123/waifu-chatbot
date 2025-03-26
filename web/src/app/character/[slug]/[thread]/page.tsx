import Image from 'next/image'

import ChatBox from '@/components/chat/chat-box'
import CharacterAvatar from '@/components/waifu-chat/character'
import { getChatByThreadId } from '@/server/actions/chat'
import { getCharacterInfo } from '@/server/actions/waifu-chat'

type Props = {
  params: {
    slug: string
    thread: string
  }
}

export const generateMetadata = async ({ params }: Props) => {
  const { slug } = params

  const character = await getCharacterInfo(slug)

  if (!character) {
    return {
      title: 'Stack not found',
      description: 'Stack not found'
    }
  }

  return {
    title: `${character.name}`
  }
}

export default async function index({ params }: Props) {
  const { slug: characterSlug, thread: threadId } = await params

  const chatHistory = await getChatByThreadId(threadId)

  const character = await getCharacterInfo(characterSlug)

  return (
    <>
      <div className="border-border-1 relative h-full max-h-[932px] w-[430px] border-x border-t border-solid bg-(image:--color-sidebar) backdrop-blur-sm">
        <ChatBox currentThreadId={threadId} chatHistory={chatHistory} />
        {character && (
          <>
            <CharacterAvatar character={character} />
            {character.fandom_image_url && (
              <Image
                src={character.fandom_image_url}
                alt={character.fandom_name}
                layout="fixed"
                width={200}
                height={100}
                className="pointer-events-none absolute bottom-4 left-[-220px] object-cover"
              />
            )}
          </>
        )}

        {character?.fandom_background_image_url && (
          <>
            <Image
              src={character.fandom_background_image_url}
              fill={true}
              layout="fixed"
              alt={character.fandom_name}
              className="select-non pointer-events-none absolute top-0 left-0 z-[-1] object-cover blur-[2px]"
            />
          </>
        )}
      </div>
    </>
  )
}
