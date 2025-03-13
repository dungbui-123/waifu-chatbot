/* eslint-disable import/no-cycle */
/* eslint-disable no-undef */

type Props = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  endpoint: string
  body?: XMLHttpRequestBodyInit
  tags?: string[]
  noCache?: boolean
  revalidate?: number
}

const fetchBase = async <T>({ method, endpoint, body, tags, noCache = false, revalidate = 3600 }: Props) => {
  const baseUrl = process.env.API_URL

  let headers: HeadersInit = {
    Accept: '*/*',
    'Access-Control-Allow-Origin': '*'
  }

  if (!(body instanceof FormData)) {
    headers = {
      ...headers,
      'Content-Type': 'application/json'
    }
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method,
    headers,
    next: {
      revalidate: noCache || method !== 'GET' ? 0 : revalidate, // 1 hour
      tags
    },
    body
  })

  if (!response.ok) {
    const error = await response.json()
    if (method === 'POST') {
      console.error(JSON.stringify(error))
      throw new Error(error.message)
    }
    return null
  }

  return (await response.json()) as T
}

export default fetchBase
