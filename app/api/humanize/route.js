import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const FREE_HUMANIZE_LIMIT = 2
const PRO_HUMANIZE_LIMIT = 10

export async function POST(req) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return Response.json({ error: 'Please sign in to use the humanizer.' }, { status: 401 })
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .single()

    const isPro = subscription?.status === 'active'
    const limit = isPro ? PRO_HUMANIZE_LIMIT : FREE_HUMANIZE_LIMIT
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

    const humanizeCount = existing?.humanize_count || 0

    if (humanizeCount >= limit) {
      return Response.json(
        { error: isPro
            ? `You've used all ${PRO_HUMANIZE_LIMIT} humanizations for today. Your limit resets tomorrow.`
            : `You've used all ${FREE_HUMANIZE_LIMIT} free humanizations today. Upgrade to Pro for ${PRO_HUMANIZE_LIMIT} per day.`
        },
        { status: 429 }
      )
    }

    const { text } = await req.json()

    if (!text || text.trim().length < 50) {
      return Response.json({ error: 'Please provide at least 50 characters of text.' }, { status: 400 })
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: `You are an expert writing editor who specializes in making AI-generated text sound authentically human. Your goal is to rewrite text so it passes AI detection tools by making it sound like it was written by a real student or person.

Follow these specific techniques:
1. VARY SENTENCE LENGTH dramatically — mix very short sentences with longer ones. Human writers naturally do this.
2. REMOVE common AI phrases like: "Furthermore", "Moreover", "In conclusion", "It is important to note", "It is worth noting", "Delve into", "In today's world", "It's crucial to", "This essay will explore"
3. ADD natural imperfections — occasional informal transitions, contractions (don't, can't, it's), and conversational phrases
4. VARY paragraph lengths — some short (2-3 sentences), some longer
5. USE unexpected word choices occasionally — humans don't always pick the most "correct" word
6. ADD specificity — replace vague AI statements with more concrete language
7. BREAK perfect parallel structure — humans don't always write in perfect lists
8. START sentences differently — not every sentence should start with "The" or a transition word
9. INCLUDE occasional rhetorical questions or direct address
10. MAINTAIN the original meaning and all key information — just change how it sounds

Rewrite the text naturally. Do not add any explanation or preamble — just output the rewritten text directly.`,
      messages: [{ role: 'user', content: `Please humanize this text:\n\n${text}` }]
    })

    const humanized = response.content.map(b => b.text || '').join('').trim()

    if (existing) {
      await supabase
        .from('usage')
        .update({ humanize_count: humanizeCount + 1 })
        .eq('user_id', userId)
        .eq('used_date', today)
    } else {
      await supabase
        .from('usage')
        .insert({ user_id: userId, used_date: today, count: 0, essay_count: 0, citation_count: 0, humanize_count: 1 })
    }

    return Response.json({ humanized, remaining: limit - (humanizeCount + 1) })

  } catch (e) {
    console.log('HUMANIZE ROUTE ERROR:', e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}