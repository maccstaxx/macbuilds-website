import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string' || message.trim().length < 5) {
      return Response.json({ error: 'Please enter a real idea' }, { status: 400 });
    }

    const ollamaResponse = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'qwen3:8b',
        prompt: `User idea: "${message.trim()}"\n\nCreate a practical build blueprint with sections: 1. Summary 2. Target User 3. MVP Features 4. Tech Stack 5. 7-Day Roadmap 6. AI Features. Keep it short and useful.`,
        stream: false,
      }),
    });

    const data = await ollamaResponse.json();

    return Response.json({ reply: data.response || "No response" });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Ollama not running or error occurred' }, { status: 500 });
  }
}
