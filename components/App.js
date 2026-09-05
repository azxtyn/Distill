'use client'
import { useState, useEffect } from 'react'
import { useUser, SignUpButton } from '@clerk/nextjs'

export default function App() {
  const [tab, setTab] = useState('text')
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [ytUrl, setYtUrl] = useState('')
  const [pdfBase64, setPdfBase64] = useState(null)
  const [pdfName, setPdfName] = useState('')
  const [notes, setNotes] = useState('')
  const [notesFormat, setNotesFormat] = useState('topics')
  const [includeQuiz, setIncludeQuiz] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)
  const [activeResult, setActiveResult] = useState('summary')
  const [remaining, setRemaining] = useState(null)
  const [isPro, setIsPro] = useState(false)
  const { isSignedIn } = useUser()

  useEffect(() => {
    if (isSignedIn) {
      fetch('/api/subscription-status')
        .then(res => res.json())
        .then(data => setIsPro(data.isPro))
        .catch(() => setIsPro(false))
    }
  }, [isSignedIn])

  const handleFile = (file) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setPdfBase64(reader.result.split(',')[1])
      setPdfName(file.name)
    }
    reader.readAsDataURL(file)
  }

  const getContent = () => {
    if (tab === 'text') return { type: 'text', value: text }
    if (tab === 'url') return { type: 'url', value: url }
    if (tab === 'youtube') return { type: 'youtube', value: ytUrl }
    if (tab === 'pdf') return { type: 'pdf', value: pdfBase64 }
    if (tab === 'notes') return { type: 'notes', value: notes, format: notesFormat }
  }

  const handleClear = () => {
    setText('')
    setUrl('')
    setYtUrl('')
    setPdfBase64(null)
    setPdfName('')
    setNotes('')
    setIncludeQuiz(false)
    setError('')
    setResults(null)
  }

  const handleSubmit = async () => {
    const content = getContent()
    if (!content?.value) { setError('Please enter some content first.'); return }
    setLoading(true)
    setError('')
    setResults(null)
    try {
      const res = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, includeQuiz: isPro ? includeQuiz : false })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setResults(data)
      setActiveResult(tab === 'notes' ? 'notes' : 'summary')
      if (typeof data.remaining === 'number') setRemaining(data.remaining)
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  const tabs = [
    { id: 'text', label: 'Text' },
    { id: 'url', label: 'URL' },
    { id: 'youtube', label: 'YouTube' },
    { id: 'pdf', label: 'PDF' },
    { id: 'notes', label: '📝 Notes' },
  ]

  const notesFormats = [
    { id: 'topics', label: 'By topic' },
    { id: 'chronological', label: 'Chronological' },
    { id: 'concepts', label: 'Key concepts' },
    { id: 'studyguide', label: 'Study guide' },
    { id: 'outline', label: 'Outline' },
  ]

  const resultTabs = [
    ...(tab === 'notes' ? [{ id: 'notes', label: 'Organized notes' }] : [
      { id: 'summary', label: 'Summary' },
      { id: 'takeaways', label: 'Key takeaways' },
      { id: 'actions', label: 'Action items' },
    ]),
    ...(results?.quiz ? [{ id: 'quiz', label: 'Quiz' }] : []),
  ]

  const hasContent = text || url || ytUrl || pdfBase64 || notes

  return (
    <section id="app" className="px-6 py-20">
      <div className="text-center mb-10">
        <p className="text-xs font-medium tracking-widest text-cyan-400 uppercase mb-2">Try it now</p>
        <h2 className="text-3xl font-medium text-white">Paste anything. Learn everything.</h2>
        {remaining !== null && (
          <p className="text-sm text-white/30 mt-2">{remaining} free Distill{remaining === 1 ? '' : 's'} left today</p>
        )}
      </div>
      <div className="max-w-2xl mx-auto card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2 flex-wrap">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`px-4 py-2 rounded-lg text-sm border transition-all ${tab === t.id
                  ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400'
                  : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}>
                {t.label}
              </button>
            ))}
          </div>
          {(hasContent || results) && (
            <button onClick={handleClear} className="text-sm text-white/30 hover:text-white transition-colors">
              ✕ Clear
            </button>
          )}
        </div>

        {tab === 'text' && (
          <textarea value={text} onChange={e => setText(e.target.value)}
            placeholder="Paste your article, notes, or any text here…"
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/20 min-h-32 resize-y focus:outline-none focus:border-cyan-400/50 transition-colors" />
        )}
        {tab === 'url' && (
          <input value={url} onChange={e => setUrl(e.target.value)}
            placeholder="https://example.com/article"
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-400/50 transition-colors" />
        )}
        {tab === 'youtube' && (
          <div>
            <input value={ytUrl} onChange={e => setYtUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-400/50 transition-colors" />
            <p className="text-xs text-white/30 mt-2">💡 Tip: If this doesn't work, click the <strong className="text-white/50">⋯ button</strong> under any YouTube video → <strong className="text-white/50">Show transcript</strong> → copy and paste it into the Text tab for best results.</p>
          </div>
        )}
        {tab === 'pdf' && (
          <div onClick={() => document.getElementById('pdf-input').click()}
            className="border border-dashed border-white/10 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-400/30 hover:bg-white/5 transition-all">
            <p className="text-sm text-white/30">{pdfName || 'Drop a PDF here, or click to browse'}</p>
            <input id="pdf-input" type="file" accept="application/pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />
          </div>
        )}
        {tab === 'notes' && (
          <div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="Paste your class notes here — messy, unformatted, bullet points, anything. Distill will organize them for you…"
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/20 min-h-40 resize-y focus:outline-none focus:border-cyan-400/50 transition-colors mb-3" />
            <p className="text-xs text-white/40 mb-2">How would you like your notes organized?</p>
            <div className="flex gap-2 flex-wrap">
              {notesFormats.map(f => (
                <button key={f.id} onClick={() => setNotesFormat(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${notesFormat === f.id
                    ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400'
                    : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <div>
            {tab !== 'notes' && (
              isPro ? (
                <label className="flex items-center gap-2 text-sm text-white/40 cursor-pointer hover:text-white/60 transition-colors">
                  <input type="checkbox" checked={includeQuiz} onChange={e => setIncludeQuiz(e.target.checked)} className="accent-cyan-400" />
                  Include quiz
                </label>
              ) : (
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-2 text-sm text-white/20 cursor-not-allowed">
                    <input type="checkbox" disabled className="accent-cyan-400 opacity-30" />
                    Include quiz
                  </label>
                  <a href="#pricing" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">✦ Pro only</a>
                </div>
              )
            )}
          </div>
          <button onClick={handleSubmit} disabled={loading}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
            {loading ? 'Analyzing…' : tab === 'notes' ? 'Organize notes →' : 'Summarize →'}
          </button>
        </div>

        {error && (
          <p className="mt-4 text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">{error}</p>
        )}

        {results && (
          <div className="mt-6">
            <div className="flex gap-2 mb-4 flex-wrap">
              {resultTabs.map(t => (
                <button key={t.id} onClick={() => setActiveResult(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm border transition-all ${activeResult === t.id
                    ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400'
                    : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="bg-white/5 border border-white/10 rounded-lg p-4 text-sm text-white/70 leading-relaxed">
              {activeResult === 'summary' && <p>{results.summary}</p>}
              {activeResult === 'takeaways' && (
                <ul className="list-disc pl-4 space-y-1">
                  {results.takeaways?.map((t, i) => <li key={i}>{t}</li>)}
                </ul>
              )}
              {activeResult === 'actions' && (
                <ul className="list-disc pl-4 space-y-1">
                  {results.actions?.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              )}
              {activeResult === 'notes' && (
                <div className="whitespace-pre-wrap">{results.organizedNotes}</div>
              )}
              {activeResult === 'quiz' && results.quiz?.map((q, qi) => (
                <QuizItem key={qi} question={q} index={qi} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

function QuizItem({ question, index }) {
  const [selected, setSelected] = useState(null)
  return (
    <div className="mb-4">
      <p className="font-medium mb-2 text-white">{index + 1}. {question.question}</p>
      {question.options.map((opt, i) => (
        <button key={i} disabled={selected !== null} onClick={() => setSelected(i)}
          className={`block w-full text-left px-3 py-2 rounded-lg border mb-1 text-sm transition-all ${
            selected === null
              ? 'border-white/10 text-white/60 hover:border-cyan-400/30 hover:bg-cyan-400/5'
              : i === question.answer
              ? 'border-cyan-400/40 bg-cyan-400/10 text-cyan-400'
              : i === selected
              ? 'border-red-400/40 bg-red-400/10 text-red-400'
              : 'border-white/10 text-white/20'}`}>
          {opt}
        </button>
      ))}
    </div>
  )
}