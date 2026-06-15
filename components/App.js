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

  return (
    <section id="app" className="px-6 py-20">
      <div className="text-center mb-10">
        <p className="text-xs font-medium tracking-widest text-emerald-600 uppercase mb-2">Try it now</p>
        <h2 className="text-3xl font-medium text-gray-900">Paste anything. Learn everything.</h2>
      </div>
      <div className="max-w-2xl mx-auto bg-white border border-gray-100 rounded-xl p-6">
        <div className="flex gap-2 mb-4 flex-wrap">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-4 py-2 rounded-lg text-sm border ${tab === t.id ? 'bg-gray-100 border-gray-300 text-gray-900' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'text' && <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste your article, notes, or any text here…" className="w-full border border-gray-200 rounded-lg p-3 text-sm min-h-32 resize-y focus:outline-none focus:border-gray-400" />}
        {tab === 'url' && <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/article" className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-gray-400" />}
        {tab === 'youtube' && <input value={ytUrl} onChange={e => setYtUrl(e.target.value)} placeholder="https://youtube.com/watch?v=..." className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-gray-400" />}
        {tab === 'pdf' && (
          <div onClick={() => document.getElementById('pdf-input').click()}
            className="border border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50">
            <p className="text-sm text-gray-500">{pdfName || 'Drop a PDF here, or click to browse'}</p>
            <input id="pdf-input" type="file" accept="application/pdf" className="hidden" onChange={e => handleFile(e.target.files[0])} />
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
            <input type="checkbox" checked={includeQuiz} onChange={e => setIncludeQuiz(e.target.checked)} />
            Include quiz
          </label>
          <button onClick={handleSubmit} disabled={loading}
            className="bg-gray-900 text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-700 disabled:opacity-40">
            {loading ? 'Analyzing…' : 'Summarize →'}
          </button>
        </div>

        {error && <p className="mt-4 text-sm text-red-500 bg-red-50 rounded-lg p-3">{error}</p>}

        {results && (
          <div className="mt-6">
            <div className="flex gap-2 mb-4 flex-wrap">
              {resultTabs.map(t => (
                <button key={t.id} onClick={() => setActiveResult(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm border ${activeResult === t.id ? 'bg-gray-100 border-gray-300 text-gray-900' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-800 leading-relaxed">
              {activeResult === 'summary' && <p>{results.summary}</p>}
              {activeResult === 'takeaways' && <ul className="list-disc pl-4 space-y-1">{results.takeaways?.map((t, i) => <li key={i}>{t}</li>)}</ul>}
              {activeResult === 'actions' && <ul className="list-disc pl-4 space-y-1">{results.actions?.map((a, i) => <li key={i}>{a}</li>)}</ul>}
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
      <p className="font-medium mb-2">{index + 1}. {question.question}</p>
      {question.options.map((opt, i) => (
        <button key={i} disabled={selected !== null} onClick={() => setSelected(i)}
          className={`block w-full text-left px-3 py-2 rounded-lg border mb-1 text-sm ${selected === null ? 'border-gray-200 hover:bg-gray-100' : i === question.answer ? 'border-emerald-400 bg-emerald-50 text-emerald-800' : i === selected ? 'border-red-300 bg-red-50 text-red-700' : 'border-gray-200 text-gray-400'}`}>
          {opt}
        </button>
      ))}
    </div>
  )
}