'use client'

import { motion } from 'framer-motion'

export default function SlideAnimate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="h-full w-full"
      initial={{ x: 20, opacity: 0 }}
      animate={{
        x: 0,
        opacity: 1,
        transition: {
          x: { duration: 0.35 },
          opacity: { duration: 1 }
        }
      }}
      exit={{
        x: -20,
        opacity: 0
      }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  )
}
