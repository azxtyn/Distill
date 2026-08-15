import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const PRO_ESSAY_LIMIT = 10

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
      return Response.json({ error: 'The AI Essay Writer is a Distill Pro feature. Upgrade to Pro to unlock it.' }, { status: 403 })
    }

    const today = new Date().toISOString().split('T')[0]

    const { data: existing, error: fetchError } = await supabase
      .from('usage')
      .select('*')
      .eq('user_id', userId)
      .eq('used_date', today)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.log('SUPABASE FETCH ERROR:', fetchError)
    }

    const essayCount = existing?.essay_count || 0

    if (essayCount >= PRO_ESSAY_LIMIT) {
      return Response.json(
        { error: `You've used all ${PRO_ESSAY_LIMIT} essays for today. Your limit resets tomorrow.` },
        { status: 429 }
      )
    }

    const { topic, type, wordCount } = await req.json()
    const essay = await generateEssay(topic, type, wordCount)

    if (existing) {
      await supabase
        .from('usage')
        .update({ essay_count: essayCount + 1 })
        .eq('user_id', userId)
        .eq('used_date', today)
    } else {
      await supabase
        .from('usage')
        .insert({ user_id: userId, used_date: today, count: 0, essay_count: 1 })
    }

    return Response.json({ essay, remaining: PRO_ESSAY_LIMIT - (essayCount + 1) })

  } catch (e) {
    console.log('ESSAY ROUTE ERROR:', e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}

async function generateEssay(topic, type, customWordCount) {
  const wordCount = customWordCount || 500

  const essayTypeInstructions = {
    argumentative: 'Write an argumentative essay that takes a clear position and supports it with evidence and reasoning.',
    persuasive: 'Write a persuasive essay that convinces the reader to agree with a specific viewpoint using emotional appeals and strong arguments.',
    expository: 'Write an expository essay that explains and informs the reader about the topic in a clear and objective way.',
    narrative: 'Write a narrative essay that tells a story related to the topic with a clear beginning, middle, and end.',
    compare: 'Write a compare and contrast essay that analyzes the similarities and differences related to the topic.',
    analytical: 'Write an analytical essay that breaks down the topic into its components and examines each one carefully.',
    descriptive: 'Write a descriptive essay that paints a vivid picture of the topic using sensory details and imagery.',
    critical: 'Write a critical analysis essay that evaluates the topic by examining its strengths, weaknesses, and implications.',
    reflective: 'Write a reflective essay that thoughtfully explores personal insights and lessons related to the topic.',
    research: 'Write a research essay that presents evidence-based arguments supported by facts and credible sources.',
    cause_effect: 'Write a cause and effect essay that examines the reasons something happened and its resulting consequences.',
    definition: 'Write a definition essay that thoroughly explains and explores the meaning and significance of the topic.',
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
    max_tokens: 4000,
    system: 'You are an expert essay writer. Write well-structured, engaging essays appropriate for academic use. Write the essay directly without any preamble or meta-commentary.',
    messages: [{ role: 'user', content: prompt }]
  })

  return response.content.map(b => b.text || '').join('')
}