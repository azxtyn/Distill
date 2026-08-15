'use client'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'

export default function EssayWriter() {
  const [topic, setTopic] = useState('')
  const [type, setType] = useState('argumentative')
  const [length, setLength] = useState('medium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [essay, setEssay] = useState('')
  const [copied, setCopied] = useState(false)
  const { isSignedIn } = useUser()

  const handleGenerate = async () => {
    if (!topic.trim()) { setError('Please enter a topic first.'); return }
    if (!isSignedIn) { setError('Please sign in to use the essay writer.'); return }
    setLoading(true)
    setError('')
    setEssay('')
    try {
      const res = await fetch('/api/essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, type, length })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setEssay(data.essay)
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(essay)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const essayTypes = [
    { id: 'argumentative', label: 'Argumentative' },
    { id: 'persuasive', label: 'Persuasive' },
    { id: 'expository', label: 'Expository' },
    { id: 'narrative', label: 'Narrative' },
    { id: 'compare', label: 'Compare & Contrast' },
    { id: 'analytical', label: 'Analytical' },
    { id: 'descriptive', label: 'Descriptive' },
    { id: 'critical', label: 'Critical Analysis' },
    { id: 'reflective', label: 'Reflective' },
    { id: 'research', label: 'Research' },
    { id: 'cause_effect', label: 'Cause & Effect' },
    { id: 'definition', label: 'Definition' },
  ]

  const lengths = [
    { id: 'short', label: 'Short (250 words)' },
    { id: 'medium', label: 'Medium (500 words)' },
    { id: 'long', label: 'Long (1000 words)' },
    { id: 'extended', label: 'Extended (1500 words)' },
    { id: 'comprehensive', label: 'Comprehensive (2000 words)' },
  ]

  return (
    <div className="min-h-screen flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-black/60">
        <a href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#111827] flex items-center justify-center">
            <svg viewBox="0 0 32 32" width="18" height="18">
              <rect x="4" y="6" width="18" height="3" rx="1.5" fill="#06B6D4"/>
              <rect x="4" y="12" width="13" height="3" rx="1.5" fill="#06B6D4" opacity="0.75"/>
              <rect x="4" y="18" width="8" height="3" rx="1.5" fill="#06B6D4" opacity="0.5"/>
              <rect x="4" y="24" width="5" height="3" rx="1.5" fill="#06B6D4" opacity="0.25"/>
            </svg>
          </div>
          <span className="font-medium text-white">distill</span>
        </a>
        <div className="flex items-center gap-6">
          <a href="/" className="text-sm text-white/50 hover:text-white transition-colors">Home</a>
          <a href="/#pricing" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</a>
        </div>
      </nav>

      <main className="flex-1 px-6 py-20">
        <div className="text-center mb-10">
          <p className="text-xs font-medium tracking-widest text-cyan-400 uppercase mb-2">AI Essay Writer</p>
          <h1 className="text-4xl font-medium text-white mb-4">Write any essay in seconds</h1>
          <p className="text-white/40 max-w-md mx-auto">Enter your topic, pick your essay type and length, and let AI do the writing.</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">
          <div className="card p-6">
            <label className="block text-sm text-white/60 mb-2">Essay topic</label>
            <textarea
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. The impact of social media on mental health, The causes of World War 1, Why renewable energy is important..."
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/20 min-h-24 resize-y focus:outline-none focus:border-cyan-400/50 transition-colors"
            />
          </div>

          <div className="card p-6">
            <label className="block text-sm text-white/60 mb-3">Essay type</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {essayTypes.map(t => (
                <button key={t.id} onClick={() => setType(t.id)}
                  className={`px-3 py-2 rounded-lg text-sm border transition-all ${type === t.id
                    ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400'
                    : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <label className="block text-sm text-white/60 mb-3">Essay length</label>
            <div className="flex gap-2 flex-wrap">
              {lengths.map(l => (
                <button key={l.id} onClick={() => setLength(l.id)}
                  className={`px-4 py-2 rounded-lg text-sm border transition-all ${length === l.id
                    ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400'
                    : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}>
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">{error}</p>}

          <button onClick={handleGenerate} disabled={loading}
            className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
            {loading ? 'Writing your essay…' : 'Generate Essay →'}
          </button>

          {essay && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-medium">Your essay</h2>
                <button onClick={handleCopy}
                  className={`text-sm transition-colors border px-3 py-1 rounded-lg ${copied
                    ? 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10'
                    : 'text-cyan-400 hover:text-cyan-300 border-cyan-400/20'}`}>
                  {copied ? '✓ Copied!' : 'Copy →'}
                </button>
              </div>
              <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{essay}</div>
              <button onClick={handleCopy}
                className={`mt-4 w-full text-sm transition-colors border px-3 py-2 rounded-lg ${copied
                  ? 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10'
                  : 'text-white/40 hover:text-white border-white/10 hover:border-white/20'}`}>
                {copied ? '✓ Copied to clipboard!' : 'Copy essay to clipboard'}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}