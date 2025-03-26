import { Character } from '@/@types/waifu-chat'
import Image from 'next/image'

type Props = {
  character: Character
}

export default function CharacterAvatar({ character }: Props) {
  return (
    <Image
      src={character.image_url}
      width={500}
      height={500}
      className="absolute bottom-14 left-2 aspect-square max-w-[3rem] animate-bounce rounded-full object-cover object-top"
      alt={character.name}
    />
  )
}
