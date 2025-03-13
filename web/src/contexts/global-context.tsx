'use client'

import React, { createContext, useMemo } from 'react'
import { useToggle } from 'usehooks-ts'

export interface IGlobalContext {
  isOpenSidebar: boolean
  toggle: () => void
  closeSidebar: () => void
}

export const GlobalContext = createContext<IGlobalContext>({
  isOpenSidebar: false,
  toggle: () => {},
  closeSidebar: () => {}
})

export const GlobalContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [value, toggle, setValue] = useToggle()

  const handleCloseSidebar = () => {
    setValue(false)
  }

  const contextValue = useMemo(
    () => ({
      isOpenSidebar: value,
      toggle,
      closeSidebar: handleCloseSidebar
    }),
    [value]
  )

  return <GlobalContext.Provider value={contextValue}>{children}</GlobalContext.Provider>
}
