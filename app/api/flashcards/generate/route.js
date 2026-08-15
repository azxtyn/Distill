import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return Response.json({ error: 'Please sign in.' }, { status: 401 })
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .single()

    if (subscription?.status !== 'active') {
      return Response.json({ error: 'AI flashcard generation is a Pro feature. Upgrade to Pro to unlock it.' }, { status: 403 })
    }

    const { topic, count } = await req.json()

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: 'You are a flashcard generator. Always respond with valid JSON only — no markdown fences, no preamble.',
      messages: [{
        role: 'user',
        content: `Generate ${count} flashcards about the following topic or notes:

${topic}

Respond ONLY with a valid JSON array of objects. Each object must have exactly two fields:
- "question": a clear, specific question or term
- "answer": a concise, accurate answer or definition

Example format:
[{"question": "What is photosynthesis?", "answer": "The process by which plants convert sunlight into food using carbon dioxide and water."}]

Generate exactly ${count} flashcards now:`
      }]
    })

    const raw = response.content.map(b => b.text || '').join('').replace(/```json|```/g, '').trim()
    const cards = JSON.parse(raw)

    if (!Array.isArray(cards)) throw new Error('Invalid response from AI')

    return Response.json({ cards })
  } catch (e) {
    console.log('FLASHCARD GENERATE ERROR:', e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}