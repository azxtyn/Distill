import Anthropic from '@anthropic-ai/sdk'
import { auth } from '@clerk/nextjs/server'
import { supabase } from '@/lib/supabase'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const PRO_ESSAY_LIMIT = 10
const PRO_EDIT_LIMIT = 5

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

    const body = await req.json()

    // Handle AI edit requests separately
    if (body.type === 'edit') {
      const editCount = existing?.essay_edit_count || 0

      if (editCount >= PRO_EDIT_LIMIT) {
        return Response.json(
          { error: `You've used all ${PRO_EDIT_LIMIT} AI edits for today. Your limit resets tomorrow.` },
          { status: 429 }
        )
      }

      const { essay, instruction } = body
      const edited = await editEssay(essay, instruction)

      if (existing) {
        await supabase
          .from('usage')
          .update({ essay_edit_count: editCount + 1 })
          .eq('user_id', userId)
          .eq('used_date', today)
      }

      return Response.json({ essay: edited, editsRemaining: PRO_EDIT_LIMIT - (editCount + 1) })
    }

    // Handle new essay generation
    const essayCount = existing?.essay_count || 0

    if (essayCount >= PRO_ESSAY_LIMIT) {
      return Response.json(
        { error: `You've used all ${PRO_ESSAY_LIMIT} essays for today. Your limit resets tomorrow.` },
        { status: 429 }
      )
    }

    const { topic, docType, style, citation, wordCount } = body
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
        .insert({ user_id: userId, used_date: today, count: 0, essay_count: 1, essay_edit_count: 0 })
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

  const mlaHeader = citation === 'MLA 9' || citation === 'MLA'
    ? `Start with the MLA header exactly like this (on separate lines):
[Your Name]
[Teacher's Name]
[Class Name]
[Due Date]

Then the centered title on the next line, then begin the essay body.`
    : citation === 'APA 7' || citation === 'APA'
    ? `Start with an APA title page formatted like this:
[Title of Essay]
[Your Name]
[Institution Name]
[Course Name and Number]
[Instructor's Name]
[Due Date]

Then begin the essay on the next page with the title centered.`
    : ''

  const prompt = `Write a ${docType} about the following topic using a ${style} writing style.

Topic: ${topic}

CRITICAL FORMATTING RULES — follow these exactly:
- Do NOT use any markdown formatting whatsoever
- Do NOT use ## or # headers
- Do NOT use --- dividers
- Do NOT use bold (**text**) or italic (*text*) markdown
- Write in plain text only, exactly like a real typed essay
- Section breaks should just be new paragraphs, not headers
- The conclusion should just be a paragraph starting naturally, not labeled "Conclusion"
- Body paragraphs should flow naturally without labels

${mlaHeader}

Requirements:
- Approximately ${wordCount} words (not counting header)
- Document type: ${docType}
- Writing style: ${style}${citationNote}
- Write like a real student — natural transitions, varied sentence length
- No markdown symbols of any kind

${citation && citation !== 'None' ? `Citation format: Follow ${citation} formatting conventions. Include properly formatted in-text citations naturally within the text. Add a Works Cited or References page at the very end using placeholder sources in correct ${citation} format.` : ''}

Write the ${docType} now in plain text:`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    system: `You are an expert academic writer. Write essays exactly as a real student would type them — plain text, no markdown formatting, no ## headers, no --- dividers, no bold or italic symbols. Write naturally flowing prose with proper paragraph breaks. Never use any markdown syntax.`,
    messages: [{ role: 'user', content: prompt }]
  })

  return response.content.map(b => b.text || '').join('')
}

async function editEssay(essay, instruction) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4000,
    system: `You are an expert essay editor. Make only the specific changes requested by the user. Keep everything else exactly the same. Never add markdown formatting. Return only the edited essay text with no explanation.`,
    messages: [{
      role: 'user',
      content: `Here is the essay:\n\n${essay}\n\nPlease make this specific change: ${instruction}\n\nReturn the full edited essay with only that change made.`
    }]
  })

  return response.content.map(b => b.text || '').join('').trim()
}