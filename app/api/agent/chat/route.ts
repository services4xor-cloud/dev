import { NextRequest } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { buildPersonaPrompt, streamChatWithAgent } from '@/lib/ai'
import { db } from '@/lib/db'
import type { AgentChatRequest } from '@/types/api'
import type { Prisma } from '@prisma/client'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const userId = (session.user as { id?: string }).id
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body: AgentChatRequest = await req.json()
  const { dimensions, message, conversationId } = body

  // Load or create conversation
  let history: { role: 'user' | 'assistant'; content: string }[] = []
  let chatId = conversationId

  if (chatId) {
    const chat = await db.agentChat.findUnique({ where: { id: chatId } })
    if (chat) {
      history = (chat.messages as { role: 'user' | 'assistant'; content: string }[]) ?? []
    }
  }

  // Build persona from graph
  const systemPrompt = await buildPersonaPrompt(dimensions)

  // Add new user message
  history.push({ role: 'user', content: message })

  // Stream response
  const stream = streamChatWithAgent(systemPrompt, history)

  // Collect full response for storage
  let fullResponse = ''

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      const response = await stream.finalMessage()
      fullResponse = response.content[0].type === 'text' ? response.content[0].text : ''

      controller.enqueue(encoder.encode(fullResponse))
      controller.close()

      // Save conversation
      history.push({ role: 'assistant', content: fullResponse })

      if (chatId) {
        await db.agentChat.update({
          where: { id: chatId },
          data: {
            messages: history as Prisma.InputJsonValue,
            dimensions: dimensions as Prisma.InputJsonValue,
          },
        })
      } else {
        const chat = await db.agentChat.create({
          data: {
            userId,
            dimensions: dimensions as Prisma.InputJsonValue,
            messages: history as Prisma.InputJsonValue,
          },
        })
        chatId = chat.id
      }
    },
  })

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain',
      'X-Conversation-Id': chatId ?? '',
    },
  })
}
