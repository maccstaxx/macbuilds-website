import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()

export async function POST(req: Request) {
  try {
    const { message } = await req.json()
    if (!message) {
      return Response.json({ error: 'Message is required' }, { status: 400 })
    }

    const response = await client.messages.create({
      model: 'claude-opus-4-8',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: `You are MacBuilds.ai — an AI product strategist and builder. The user wants to build this: "${message}"

Return a clean, practical build blueprint with the following sections. Format each section with its number and title on its own line, followed by the content:

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

Keep it founder-friendly, practical, and direct. No fluff.`,
        },
      ],
    })

    const reply = response.content[0].type === 'text' ? response.content[0].text : ''
    return Response.json({ reply })
  } catch (error) {
    console.error(error)
    return Response.json({ error: 'AI request failed' }, { status: 500 })
  }
}
