'use client'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import Footer from '@/components/Footer'

export default function CitationGenerator() {
  const [sourceType, setSourceType] = useState('website')
  const [input, setInput] = useState('')
  const [format, setFormat] = useState('MLA 9')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [citation, setCitation] = useState('')
  const [copied, setCopied] = useState(false)
  const { isSignedIn } = useUser()

  const sourceTypes = [
    { id: 'website', label: '🌐 Website / URL' },
    { id: 'book', label: '📚 Book' },
    { id: 'article', label: '📰 Journal Article' },
    { id: 'video', label: '▶️ YouTube Video' },
    { id: 'newspaper', label: '🗞️ Newspaper' },
  ]

  const formats = [
    'MLA 9', 'APA 7', 'Chicago', 'Turabian', 'Harvard',
    'IEEE', 'AMA', 'ACS', 'Vancouver'
  ]

  const placeholders = {
    website: 'Paste the full URL — e.g. https://www.nasa.gov/article/...',
    book: 'Enter book title and author — e.g. "To Kill a Mockingbird" by Harper Lee',
    article: 'Enter article title, author, and journal name — e.g. "Climate Change Effects" by John Smith, Nature Journal 2023',
    video: 'Paste the YouTube URL — e.g. https://youtube.com/watch?v=...',
    newspaper: 'Enter article title, author, and newspaper — e.g. "Economy Grows" by Jane Doe, New York Times, Jan 5 2024',
  }

  const handleGenerate = async () => {
    if (!input.trim()) { setError('Please enter a source first.'); return }
    if (!isSignedIn) { setError('Please sign in to use the citation generator.'); return }
    setLoading(true)
    setError('')
    setCitation('')
    try {
      const res = await fetch('/api/cite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceType, input, format })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setCitation(data.citation)
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(citation)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

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

      <main className="flex-1 px-6 py-16">
        <div className="text-center mb-10">
          <p className="text-xs font-medium tracking-widest text-cyan-400 uppercase mb-2">Citation Generator</p>
          <h1 className="text-4xl font-medium text-white mb-4">Cite any source instantly</h1>
          <p className="text-white/40 max-w-md mx-auto">Paste a URL, book title, or article name and get a perfectly formatted citation in seconds.</p>
          <p className="text-white/20 text-sm mt-2">Free users get 3 citations per day — <a href="/#pricing" className="text-cyan-400 hover:text-cyan-300">upgrade to Pro</a> for unlimited</p>
        </div>

        <div className="max-w-2xl mx-auto space-y-6">

          {/* Source type */}
          <div className="card p-6">
            <label className="block text-sm text-white/60 mb-3">Source type</label>
            <div className="flex gap-2 flex-wrap">
              {sourceTypes.map(s => (
                <button key={s.id} onClick={() => { setSourceType(s.id); setInput('') }}
                  className={`px-4 py-2 rounded-lg text-sm border transition-all ${sourceType === s.id
                    ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400'
                    : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="card p-6">
            <label className="block text-sm text-white/60 mb-2">Source information</label>
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder={placeholders[sourceType]}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/20 min-h-24 resize-y focus:outline-none focus:border-cyan-400/50 transition-colors"
            />
          </div>

          {/* Citation format */}
          <div className="card p-6">
            <label className="block text-sm text-white/60 mb-3">Citation format</label>
            <div className="flex gap-2 flex-wrap">
              {formats.map(f => (
                <button key={f} onClick={() => setFormat(f)}
                  className={`px-4 py-2 rounded-lg text-sm border transition-all ${format === f
                    ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400'
                    : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {error && <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">{error}</p>}

          <button onClick={handleGenerate} disabled={loading}
            className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
            {loading ? 'Generating citation…' : 'Generate citation →'}
          </button>

          {citation && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-medium">{format} Citation</h2>
                <button onClick={handleCopy}
                  className={`text-sm transition-colors border px-3 py-1 rounded-lg ${copied
                    ? 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10'
                    : 'text-cyan-400 hover:text-cyan-300 border-cyan-400/20'}`}>
                  {copied ? '✓ Copied!' : 'Copy →'}
                </button>
              </div>
              <p className="text-white/70 text-sm leading-relaxed font-mono bg-white/5 rounded-lg p-4">{citation}</p>
              <p className="text-white/20 text-xs mt-3">⚠️ Always double-check citations against your style guide — AI may make minor formatting errors.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}