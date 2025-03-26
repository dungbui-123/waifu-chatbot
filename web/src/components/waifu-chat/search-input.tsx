'use client'

import { useState } from 'react'
import { Input } from '../ui/input'
import { useFindCharacterByNameMutation } from '@/data/waifu-chatbot'
import { useEventListener } from 'usehooks-ts'
import { toast } from 'sonner'
import { Character } from '@/@types/waifu-chat'
import CharacterInfo from './character-info'

export default function SearchInput() {
  const [characterName, setCharacterName] = useState<string>('')
  const [foundCharacter, setFoundCharacter] = useState<Character | null>(null)
  const { mutateAsync: findCharacterByName, isPending } = useFindCharacterByNameMutation()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCharacterName(e.target.value)
  }

  const handleSend = async () => {
    try {
      setCharacterName('')

      const response = await findCharacterByName(characterName)

      if (!response) throw new Error('Character not found')

      setFoundCharacter(response)
    } catch (error) {
      console.error('Error finding character:', error)
      toast.error('Character not found')
    }
  }

  useEventListener('keydown', async (e: KeyboardEvent) => {
    if (e.key === 'Enter' && characterName.trim() !== '') {
      await handleSend()
    }
  })

  return (
    <>
      <Input
        className="w-full rounded-full"
        placeholder={isPending ? 'Searching...' : 'Monkey D. Luffy etc...'}
        value={characterName}
        onChange={handleChange}
        disabled={isPending}
      />

      {foundCharacter && <CharacterInfo character={foundCharacter} />}
    </>
  )
}
