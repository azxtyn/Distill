'use client'
import { useState } from 'react'

export default function App() {
  const [tab, setTab] = useState('text')
  const [text, setText] = useState('')
  const [url, setUrl] = useState('')
  const [ytUrl, setYtUrl] = useState('')
  const [pdfBase64, setPdfBase64] = useState(null)
  const [pdfName, setPdfName] = useState('')
  const [includeQuiz, setIncludeQuiz] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [results, setResults] = useState(null)
  const [activeResult, setActiveResult] = useState('summary')
  const [remaining, setRemaining] = useState(null)

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
  }

  const handleClear = () => {
    setText('')
    setUrl('')
    setYtUrl('')
    setPdfBase64(null)
    setPdfName('')
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
        body: JSON.stringify({ content, includeQuiz })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setResults(data)
      setActiveResult('summary')
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
  ]

  const resultTabs = [
    { id: 'summary', label: 'Summary' },
    { id: 'takeaways', label: 'Key takeaways' },
    { id: 'actions', label: 'Action items' },
    ...(results?.quiz ? [{ id: 'quiz', label: 'Quiz' }] : []),
  ]

  const hasContent = text || url || ytUrl || pdfBase64

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
          <input value={ytUrl} onChange={e => setYtUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-400/50 transition-colors" />
        )}
        {tab === 'pdf' && (
          <div onClick={() => document.getElementById('pdf-input').click()}
            className="border border-dashed border-white/10 rounded-lg p-8 text-center cursor-pointer hover:border-cyan-400/30 hover:bg-white/5 transition-all">
            <p className="text-sm text-white/30">{pdfName || 'Drop a PDF here, or click to browse'}</p>
            <input id="pdf-input" type="file" accept="application/pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <label className="flex items-center gap-2 text-sm text-white/40 cursor-pointer hover:text-white/60 transition-colors">
            <input type="checkbox" checked={includeQuiz} onChange={e => setIncludeQuiz(e.target.checked)} className="accent-cyan-400" />
            Include quiz
          </label>
          <button onClick={handleSubmit} disabled={loading}
            className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
            {loading ? 'Analyzing…' : 'Summarize →'}
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