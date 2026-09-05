import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'
import { YoutubeTranscript } from 'youtube-transcript-plus'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const FREE_DAILY_LIMIT = 5
const PRO_DAILY_LIMIT = 50

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
    const dailyLimit = isPro ? PRO_DAILY_LIMIT : FREE_DAILY_LIMIT

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

    if (currentCount >= dailyLimit) {
      return Response.json(
        { error: isPro
            ? `You've used all ${PRO_DAILY_LIMIT} Distills for today. Your limit resets tomorrow.`
            : `You've used all ${FREE_DAILY_LIMIT} free Distills today. Upgrade to Pro for 50 Distills per day.`
        },
        { status: 429 }
      )
    }

    const { content, includeQuiz } = await req.json()

    // Handle notes tab separately
    if (content.type === 'notes') {
      const formatInstructions = {
        topics: 'Organize the notes by topic. Create clear topic headings and group related information under each heading.',
        chronological: 'Organize the notes in chronological order. Use timestamps or sequential headings to show the flow of information.',
        concepts: 'Extract and organize the key concepts. For each concept, provide a clear definition and any related details.',
        studyguide: 'Create a comprehensive study guide. Include key terms, important facts, main concepts, and potential exam questions at the end.',
        outline: 'Create a structured outline with main points (I, II, III) and sub-points (A, B, C) organizing all the information hierarchically.',
      }

      const format = content.format || 'topics'
      const prompt = `You are a note-taking assistant. A student has given you their raw class notes. ${formatInstructions[format]}

Here are the raw notes:

${content.value}

Organize these notes clearly and professionally. Use markdown-style formatting with headers (##) and bullet points. Make it easy to study from.`

      const response = await client.messages.create({
        model: 'claude-sonnet-4-6',
        max_tokens: 2000,
        system: 'You are an expert note organizer. Take raw messy class notes and organize them into clean, structured, easy-to-study notes. Never add information that wasn\'t in the original notes.',
        messages: [{ role: 'user', content: prompt }]
      })

      const organizedNotes = response.content.map(b => b.text || '').join('')

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
          .insert({ user_id: userId, used_date: today, count: 1, essay_count: 0 })
        updateError = error
      }

      if (updateError) console.log('SUPABASE UPDATE ERROR:', updateError)

      return Response.json({ organizedNotes, remaining: isPro ? null : FREE_DAILY_LIMIT - (currentCount + 1) })
    }

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
        .insert({ user_id: userId, used_date: today, count: 1, essay_count: 0 })
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