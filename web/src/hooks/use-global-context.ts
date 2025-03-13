'use client'

import { GlobalContext } from '@/contexts/global-context'
import { useContext } from 'react'

export default function useGlobalContext() {
  return useContext(GlobalContext)
}
