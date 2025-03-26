'use client'

import { Character } from '@/@types/waifu-chat'
import Link from 'next/link'
import Image from 'next/image'
import { useStartChatMutation } from '@/data/waifu-chatbot'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

type Props = {
  character: Character
}

export default function CharacterInfo({ character }: Props) {
  const { mutateAsync: startChat } = useStartChatMutation()
  const router = useRouter()

  const handleStartChat = async () => {
    try {
      const response = await startChat(character.slug)

      if (!response) throw new Error('Failed to start chat')

      router.push(`/character/${character.slug}/${response.thread_id}`)
    } catch (error) {
      console.error(error)
      toast.error('Failed to start chat')
    }
  }

  return (
    <div
      title="start chat"
      className="mt-2 flex aspect-video w-min cursor-pointer items-center justify-between gap-4 rounded-md border p-4 shadow transition-shadow hover:shadow-xl"
      onClick={handleStartChat}
    >
      <div>
        <h1>{character.name}</h1>

        <Link target="_blank" href={character.fandom_url} className="">
          Fandom Link
        </Link>
      </div>

      <Image
        src={character.image_url}
        width={500}
        height={500}
        className="max-w-[5rem] rounded-md"
        alt="Picture of the author"
      />
    </div>
  )
}
