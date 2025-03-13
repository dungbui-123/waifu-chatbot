import { ChatResponse } from '@/@types/chat'
import { remark } from 'remark'
import html from 'remark-html'

export const removeDuplicateValues = (array: ChatResponse[]) => {
  return [...new Set(array)]
}

export const parseMarkdown = async (data: string) => {
  const processedContent = await remark().use(html).process(data)
  return processedContent.toString()
}
