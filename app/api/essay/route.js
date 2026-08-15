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

    const { topic, docType, style, citation, wordCount } = await req.json()
    const essay = await generateEssay(topic, docType, style, citation, wordCount)

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

async function generateEssay(topic, docType, style, citation, customWordCount) {
  const wordCount = customWordCount || 500

  const citationNote = citation && citation !== 'None'
    ? `\n- Follow ${citation} citation format conventions throughout`
    : ''

  const prompt = `Write a ${docType} about the following topic using a ${style} writing style.

Topic: ${topic}

Requirements:
- Approximately ${wordCount} words
- Document type: ${docType}
- Writing style: ${style}${citationNote}
- Include appropriate structure for a ${docType} (introduction, body, conclusion or equivalent)
- Use clear language appropriate for high school or college level
- Make it well-structured and engaging

${citation && citation !== 'None' ? `Citation format note: Follow ${citation} formatting conventions. Include properly formatted in-text citations and a works cited/references section at the end using placeholder sources that demonstrate correct ${citation} format.` : ''}

Write the ${docType} now:`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    system: `You are an expert academic writer specializing in all types of documents and writing styles. Write the requested document directly without any preamble or meta-commentary. Follow the specified writing style and citation format precisely.`,
    messages: [{ role: 'user', content: prompt }]
  })

  return response.content.map(b => b.text || '').join('')
}