'use client'

import { Thread } from '@/@types/thread'
import { useDeleteThreadByIdMutation } from '@/data/thread'
import useGlobalContext from '@/hooks/use-global-context'
import useInvalidateTag from '@/hooks/use-invalidate-tag'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'
import { GiHamburgerMenu, GiSpikesHalf, GiTrashCan } from 'react-icons/gi'
import { toast } from 'sonner'

const toolVariants = cva(
  'border-border-bright absolute z-10 cursor-pointer border-y border-l bg-(image:--color-sidebar) text-base backdrop-blur-3xl transition-all duration-150',
  {
    variants: {
      type: {
        icon: 'flex h-7 w-7 cursor-pointer items-center justify-center hover:w-tool-hover hover:translate-x-[-8px] left-tool-left',
        text: 'h-7 px-2 italic cursor-not-allowed'
      }
    },
    defaultVariants: {
      type: 'icon'
    }
  }
)

interface ToolProps extends VariantProps<typeof toolVariants> {
  children: React.ReactNode
  className?: string
  title: string
  onClick?: () => void
}

function Tool({ children, className, type, title, onClick }: ToolProps) {
  const elementRef = React.useRef<HTMLDivElement>(null)

  const handleOnClick = () => {
    if (typeof onClick === 'function') {
      onClick()
    }
  }

  useEffect(() => {
    if (elementRef.current && type === 'text') {
      elementRef.current.style.left = '-' + elementRef.current.offsetWidth + 'px'
    }
  }, [elementRef, type, title])

  return (
    <div ref={elementRef} className={cn(toolVariants({ type }), className)} title={title} onClick={handleOnClick}>
      {children}
    </div>
  )
}

type Props = {
  currentThread: Thread | null
}

export default function ToolBox({ currentThread }: Props) {
  const router = useRouter()

  const { invalidateTag } = useInvalidateTag()
  const { toggle, closeSidebar } = useGlobalContext()
  const { mutateAsync: deleteThreadById } = useDeleteThreadByIdMutation()

  const handleDeleteThread = async () => {
    try {
      if (!currentThread) return

      await deleteThreadById(currentThread.id)

      invalidateTag(['threads'])
      router.push('/')
      toast.success(`Thread \`${currentThread.title}\` has been deleted`)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="absolute top-[5rem] left-0 flex flex-col items-start">
      {currentThread && (
        <Tool title="" type="text" className="top-tool-size left-[-15rem] w-max">
          {currentThread.title}
        </Tool>
      )}

      <Tool title="History" className="top-2-tool-size" onClick={toggle}>
        <GiHamburgerMenu />
      </Tool>

      {currentThread && (
        <>
          <Link href="/">
            <Tool title="New chat" className="top-3-tool-size" onClick={closeSidebar}>
              <GiSpikesHalf />
            </Tool>
          </Link>

          <Tool title="Delete chat" className="top-4-tool-size text-danger-btn" onClick={handleDeleteThread}>
            <GiTrashCan />
          </Tool>
        </>
      )}
    </div>
  )
}
