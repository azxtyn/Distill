import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { YoutubeTranscript } from 'youtube-transcript'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const FREE_DAILY_LIMIT = 5

export async function POST(req) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return Response.json({ error: 'Please sign in to use Distill.' }, { status: 401 })
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('status')
      .eq('user_id', userId)
      .single()

    const isPro = subscription?.status === 'active'

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

    const currentCount = existing?.count || 0

    if (!isPro && currentCount >= FREE_DAILY_LIMIT) {
      return Response.json(
        { error: `You've used all ${FREE_DAILY_LIMIT} free Distills today. Upgrade to Pro for unlimited access.` },
        { status: 429 }
      )
    }

    const { content, includeQuiz } = await req.json()

    const quizNote = includeQuiz
      ? '\n6. "quiz": array of 3 objects each with "question" string, "options" array of 4 strings, "answer" integer 0-3.'
      : ''

    let userContent = []

    if (content.type === 'youtube') {
      try {
        const transcript = await YoutubeTranscript.fetchTranscript(content.value)
        const transcriptText = transcript.map(t => t.text).join(' ')
        const prompt = `Here is the transcript of a YouTube video:\n\n${transcriptText}\n\nRespond ONLY with valid JSON with keys:\n1. "summary": 2-4 sentence overview.\n2. "takeaways": array of 4-6 key insight strings.\n3. "actions": array of 3-5 concrete action item strings.${quizNote}`
        userContent = prompt
      } catch (e) {
        return Response.json({
          error: 'Could not fetch transcript for this YouTube video. Make sure the video has captions enabled, or paste the transcript text directly into the Text tab.'
        }, { status: 400 })
      }
    } else if (content.type === 'pdf' && content.value) {
      userContent = [
        { type: 'document', source: { type: 'base64', media_type: 'application/pdf', data: content.value } },
        { type: 'text', text: buildPrompt(content, quizNote) }
      ]
    } else {
      userContent = buildPrompt(content, quizNote)
    }

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1000,
      system: 'You are a content summarization assistant. Respond with valid JSON only — no markdown fences, no preamble.',
      messages: [{ role: 'user', content: userContent }]
    })

    const raw = response.content.map(b => b.text || '').join('').replace(/```json|```/g, '').trim()
    const parsed = JSON.parse(raw)

    let updateError = null
    if (existing) {
      const { error } = await supabase
        .from('usage')
        .update({ count: currentCount + 1 })
        .eq('user_id', userId)
        .eq('used_date', today)
      updateError = error
    } else {
      const { error } = await supabase
        .from('usage')
        .insert({ user_id: userId, used_date: today, count: 1 })
      updateError = error
    }

    if (updateError) {
      console.log('SUPABASE UPDATE/INSERT ERROR:', updateError)
    }

    return Response.json({ ...parsed, remaining: isPro ? null : FREE_DAILY_LIMIT - (currentCount + 1) })
  } catch (e) {
    console.log('ROUTE CATCH ERROR:', e)
    return Response.json({ error: e.message }, { status: 500 })
  }
}

function buildPrompt(content, quizNote) {
  let block = ''
  if (content.type === 'text') block = `Content to analyze:\n\n${content.value}`
  else if (content.type === 'url') block = `Analyze this article URL and summarize what this page is likely about based on the URL: ${content.value}`
  else block = 'Analyze the attached PDF document.'

  return `${block}\n\nRespond ONLY with valid JSON with keys:\n1. "summary": 2-4 sentence overview.\n2. "takeaways": array of 4-6 key insight strings.\n3. "actions": array of 3-5 concrete action item strings.${quizNote}`
}