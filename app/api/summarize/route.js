import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req) {
  try {
    const { content, includeQuiz } = await req.json()

    const quizNote = includeQuiz
      ? '\n6. "quiz": array of 3 objects each with "question" string, "options" array of 4 strings, "answer" integer 0-3.'
      : ''

    let userContent = []

    if (content.type === 'pdf' && content.value) {
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

    return Response.json(parsed)
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 })
  }
}

function buildPrompt(content, quizNote) {
  let block = ''
  if (content.type === 'text') block = `Content to analyze:\n\n${content.value}`
  else if (content.type === 'url') block = `Analyze this article URL and summarize what this page is likely about based on the URL: ${content.value}`
  else if (content.type === 'youtube') block = `A user has shared this YouTube URL: ${content.value}. Based on the URL and any information you can infer about this video, provide a helpful summary. If you cannot determine the content, summarize what the channel or topic is likely about and provide general takeaways.`
  else block = 'Analyze the attached PDF document.'

  return `${block}\n\nRespond ONLY with valid JSON with keys:\n1. "summary": 2-4 sentence overview.\n2. "takeaways": array of 4-6 key insight strings.\n3. "actions": array of 3-5 concrete action item strings.${quizNote}`
}