export interface SendChatRequest {
  messages: string[]
  thread_id: string
  action: 'send' | 'start'
}

export type MessageType = 'human' | 'ai' | 'tool'

export interface ChatResponse {
  id: string
  thread_id: string
  content: string
  type: MessageType
}
