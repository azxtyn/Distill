import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return Response.json({ error: 'Please sign in to use the essay writer.' }, { status: 401 })
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .single()

    const isPro = subscription?.status === 'active'

    if (!isPro) {
      return Response.json({ error: 'The AI essay writer is a Pro feature. Upgrade to Distill Pro to unlock it.' }, { status: 403 })
    }

    const { topic, type, length } = await req.json()

    const wordCount = length === 'short' ? 250 : length === 'long' ? 1000 : 500

    const essayTypeInstructions = {
      argumentative: 'Write an argumentative essay that takes a clear position and supports it with evidence and reasoning.',
      persuasive: 'Write a persuasive essay that convinces the reader to agree with a specific viewpoint using emotional appeals and strong arguments.',
      expository: 'Write an expository essay that explains and informs the reader about the topic in a clear and objective way.',
      narrative: 'Write a narrative essay that tells a story related to the topic with a clear beginning, middle, and end.',
      compare: 'Write a compare and contrast essay that analyzes the similarities and differences related to the topic.',
      analytical: 'Write an analytical essay that breaks down the topic into its components and examines each one carefully.',
    }

    const prompt = `${essayTypeInstructions[type] || essayTypeInstructions.argumentative}

Topic: ${topic}

Requirements:
- Approximately ${wordCount} words
- Include an introduction, body paragraphs, and conclusion
- Use clear, academic language appropriate for high school or college level
- Make it well-structured and engaging

Write the essay now:`

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      system: 'You are an expert essay writer. Write well-structured, engaging essays that are appropriate for academic use. Write the essay directly without any preamble or meta-commentary.',
      messages: [{ role: 'user', content: prompt }]
    })

    const essay = response.content.map(b => b.text || '').join('')

    return Response.json({ essay })
  } catch (e) {
    console.log('ESSAY ROUTE ERROR:', e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}