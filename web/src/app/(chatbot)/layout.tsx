export default function ChatbotLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="border-border-1 relative h-full max-h-[932px] w-[430px] border-x border-t border-solid bg-(image:--color-sidebar) backdrop-blur-sm">
      {children}
    </div>
  )
}
