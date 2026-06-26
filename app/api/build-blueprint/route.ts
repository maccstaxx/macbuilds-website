import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { message, password } = await req.json()

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return Response.json({ error: 'Please enter a real idea.' }, { status: 400 })
    }

    if (message.length > 800) {
      return Response.json({ error: 'Keep the idea under 800 characters.' }, { status: 400 })
    }

    const requiredPassword = process.env.BOT_PASSWORD || (process.env.NODE_ENV !== 'production' ? 'macbuilds' : '')

    if (!requiredPassword) {
      return Response.json({ error: 'Bot password is not configured.' }, { status: 500 })
    }

    if (password !== requiredPassword) {
      return Response.json({ error: 'Wrong password.' }, { status: 401 })
    }

    const prompt = `You are MacBuilds.ai — an AI product strategist and builder.

The user wants to build this:
"${message.trim()}"

Return a clean, practical build blueprint with these sections:

1. Product Idea Summary
2. Target User
3. Core Problem
4. MVP Features
5. Recommended Tech Stack
6. Database Schema Ideas
7. AI Features To Include
8. 7-Day Build Roadmap
9. Monetization Ideas
10. What Mac Would Build First

Keep it founder-friendly, practical, and direct.`

    if (process.env.OPENAI_API_KEY) {
      const openAIResponse = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: process.env.OPENAI_MODEL || 'gpt-4.1-mini',
          input: prompt,
          max_output_tokens: 900,
        }),
      })

      const data = await openAIResponse.json()

      if (!openAIResponse.ok) {
        return Response.json({ error: data?.error?.message || 'OpenAI request failed.' }, { status: 500 })
      }

      return Response.json({ reply: data.output_text || 'No response returned.' })
    }

    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3:8b',
        prompt,
        stream: false,
      }),
    })

    const data = await ollamaResponse.json()

    return Response.json({ reply: data.response || 'No response returned.' })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'AI request failed.' }, { status: 500 })
  }
}
