import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const FREE_CITATION_LIMIT = 3

export async function POST(req) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return Response.json({ error: 'Please sign in to use the citation generator.' }, { status: 401 })
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .single()

    const isPro = subscription?.status === 'active'
    const today = new Date().toISOString().split('T')[0]

    if (!isPro) {
      const { data: existing, error: fetchError } = await supabase
        .from('usage')
        .select('*')
        .eq('user_id', userId)
        .eq('used_date', today)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        console.log('SUPABASE FETCH ERROR:', fetchError)
      }

      const citationCount = existing?.citation_count || 0

      if (citationCount >= FREE_CITATION_LIMIT) {
        return Response.json(
          { error: `You've used all ${FREE_CITATION_LIMIT} free citations today. Upgrade to Pro for unlimited citations.` },
          { status: 429 }
        )
      }

      const { sourceType, input, format } = await req.json()
      const citation = await generateCitation(sourceType, input, format)

      if (existing) {
        await supabase
          .from('usage')
          .update({ citation_count: citationCount + 1 })
          .eq('user_id', userId)
          .eq('used_date', today)
      } else {
        await supabase
          .from('usage')
          .insert({ user_id: userId, used_date: today, count: 0, essay_count: 0, citation_count: 1 })
      }

      return Response.json({ citation, remaining: FREE_CITATION_LIMIT - (citationCount + 1) })
    }

    const { sourceType, input, format } = await req.json()
    const citation = await generateCitation(sourceType, input, format)
    return Response.json({ citation, remaining: null })

  } catch (e) {
    console.log('CITATION ROUTE ERROR:', e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}

async function generateCitation(sourceType, input, format) {
  const sourceInstructions = {
    website: 'The user has provided a website URL or website information.',
    book: 'The user has provided a book title and/or author information.',
    article: 'The user has provided a journal article title, author, and/or journal information.',
    video: 'The user has provided a YouTube video URL or video information.',
    newspaper: 'The user has provided a newspaper article title, author, and/or newspaper information.',
  }

  const prompt = `Generate a properly formatted ${format} citation for the following source.

Source type: ${sourceType}
${sourceInstructions[sourceType]}
Source information provided: ${input}

Important instructions:
- Generate ONLY the citation text, nothing else
- Follow ${format} formatting rules exactly
- If information is missing, use reasonable placeholders like [Author Last Name] or [Year]
- For websites, use "n.d." if no date is available
- Make it ready to copy and paste directly into a bibliography or works cited page
- Do not include any explanation or preamble — just the citation itself`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 500,
    system: `You are an expert academic citation generator. You know ${format} citation format perfectly. Generate only the citation text with no additional commentary.`,
    messages: [{ role: 'user', content: prompt }]
  })

  return response.content.map(b => b.text || '').join('').trim()
}