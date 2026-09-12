'use client'
import { useState, useMemo } from 'react'
import { useUser } from '@clerk/nextjs'
import Footer from '@/components/Footer'

const documentTypes = {
  'Essays': [
    'Argumentative Essay', 'Persuasive Essay', 'Expository Essay', 'Narrative Essay',
    'Personal Narrative', 'Descriptive Essay', 'Analytical Essay', 'Critical Essay',
    'Compare and Contrast Essay', 'Cause and Effect Essay', 'Problem and Solution Essay',
    'Definition Essay', 'Classification Essay', 'Process Essay', 'Reflective Essay',
    'Response Essay', 'Evaluation Essay', 'Synthesis Essay', 'Rhetorical Analysis Essay',
    'Literary Analysis Essay', 'Informative Essay', 'Opinion Essay'
  ],
  'Research & Academic': [
    'Research Paper', 'Research Proposal', 'Term Paper', 'Position Paper',
    'Analysis Paper', 'Argument Paper', 'Literature Review', 'Systematic Review',
    'Case Study', 'Concept Paper', 'Discussion Paper', 'White Paper',
    'Policy Paper', 'Academic Report', 'Thesis', 'Dissertation', 'Capstone Paper'
  ],
  'Science & Technical': [
    'Lab Report', 'Scientific Report', 'Technical Report', 'Experimental Report',
    'Field Report', 'Research Report', 'Engineering Report', 'Scientific Abstract',
    'Lab Notebook Entry', 'Observation Report'
  ],
  'Reading & Literature': [
    'Book Report', 'Book Review', 'Reading Log', 'Reading Journal', 'Reading Response',
    'Character Analysis', 'Theme Analysis', 'Chapter Summary', 'Book Summary',
    'Text Analysis', 'Literary Response', 'Poetry Analysis'
  ],
  'Personal & Reflective': [
    'Personal Essay', 'Personal Statement', 'Autobiography', 'Memoir',
    'Reflection Paper', 'Reflective Journal', 'Journal Entry', 'Diary Entry',
    'Learning Reflection', 'Self-Reflection', 'College Application Essay',
    'Scholarship Essay', 'Statement of Purpose'
  ],
  'Professional': [
    'Business Report', 'Business Proposal', 'Project Proposal', 'Executive Summary',
    'Business Plan', 'Meeting Report', 'Progress Report', 'Incident Report',
    'Feasibility Report', 'Memorandum', 'Press Release', 'Newsletter',
    'Article', 'Blog Post', 'News Article', 'Editorial', 'Op-Ed'
  ],
  'Creative Writing': [
    'Short Story', 'Flash Fiction', 'Script', 'Screenplay', 'Play',
    'Monologue', 'Dialogue', 'Poetry', 'Poem', 'Creative Nonfiction',
    'Fan Fiction', 'Character Profile'
  ],
  'Speeches': [
    'Speech', 'Persuasive Speech', 'Informative Speech', 'Demonstrative Speech',
    'Debate Speech', 'Graduation Speech', 'Presentation Script', 'Debate Argument'
  ]
}

const writingStyles = {
  'Academic': [
    'Academic', 'Scholarly', 'Formal', 'Analytical', 'Critical',
    'Objective', 'Research-Based', 'Evidence-Based', 'Technical', 'Scientific'
  ],
  'Rhetorical': [
    'Persuasive', 'Argumentative', 'Informative', 'Expository', 'Descriptive',
    'Narrative', 'Comparative', 'Evaluative', 'Interpretive', 'Reflective'
  ],
  'Creative': [
    'Creative', 'Poetic', 'Literary', 'Dramatic', 'Storytelling',
    'Imaginative', 'Experimental'
  ],
  'Professional': [
    'Professional', 'Business', 'Journalistic', 'Concise', 'Direct', 'Instructional'
  ],
  'Tone': [
    'Formal', 'Informal', 'Conversational', 'Friendly', 'Serious',
    'Neutral', 'Confident', 'Humorous', 'Inspirational', 'Emotional',
    'Thoughtful', 'Respectful', 'Enthusiastic', 'Authoritative',
    'Casual', 'Sophisticated', 'Simple', 'Straightforward'
  ]
}

const citationFormats = [
  'None', 'MLA 9', 'APA 7', 'Chicago', 'Turabian', 'Harvard',
  'IEEE', 'AMA', 'ACS', 'Vancouver'
]

export default function EssayWriter() {
  const [topic, setTopic] = useState('')
  const [docType, setDocType] = useState('Argumentative Essay')
  const [style, setStyle] = useState('Academic')
  const [citation, setCitation] = useState('None')
  const [wordCount, setWordCount] = useState(500)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [error, setError] = useState('')
  const [essay, setEssay] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [editedEssay, setEditedEssay] = useState('')
  const [aiEditInstruction, setAiEditInstruction] = useState('')
  const [showAiEdit, setShowAiEdit] = useState(false)
  const [editsRemaining, setEditsRemaining] = useState(5)
  const [copied, setCopied] = useState(false)
  const { isSignedIn } = useUser()

  const filteredDocTypes = useMemo(() => {
    if (!search) return documentTypes
    const q = search.toLowerCase()
    const result = {}
    Object.entries(documentTypes).forEach(([cat, items]) => {
      const filtered = items.filter(i => i.toLowerCase().includes(q))
      if (filtered.length > 0) result[cat] = filtered
    })
    return result
  }, [search])

  const filteredStyles = useMemo(() => {
    if (!search) return writingStyles
    const q = search.toLowerCase()
    const result = {}
    Object.entries(writingStyles).forEach(([cat, items]) => {
      const filtered = items.filter(i => i.toLowerCase().includes(q))
      if (filtered.length > 0) result[cat] = filtered
    })
    return result
  }, [search])

  const handleGenerate = async () => {
    if (!topic.trim()) { setError('Please enter a topic first.'); return }
    if (!isSignedIn) { setError('Please sign in to use the essay writer.'); return }
    if (wordCount < 100 || wordCount > 3000) { setError('Word count must be between 100 and 3000.'); return }
    setLoading(true)
    setError('')
    setEssay('')
    setEditedEssay('')
    setIsEditing(false)
    setShowAiEdit(false)
    try {
      const res = await fetch('/api/essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, docType, style, citation, wordCount })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setEssay(data.essay)
      setEditedEssay(data.essay)
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  const handleAiEdit = async () => {
    if (!aiEditInstruction.trim()) { setError('Please enter what changes you want.'); return }
    if (editsRemaining <= 0) { setError('No AI edits remaining today.'); return }
    setEditing(true)
    setError('')
    try {
      const res = await fetch('/api/essay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'edit', essay: editedEssay, instruction: aiEditInstruction })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Something went wrong')
      setEditedEssay(data.essay)
      setEditsRemaining(data.editsRemaining)
      setAiEditInstruction('')
      setShowAiEdit(false)
    } catch (e) {
      setError(e.message)
    }
    setEditing(false)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(editedEssay || essay)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleWordCountChange = (e) => {
    const val = parseInt(e.target.value)
    if (isNaN(val)) { setWordCount(''); return }
    if (val > 3000) { setWordCount(3000); return }
    setWordCount(val)
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
          <p className="text-xs font-medium tracking-widest text-cyan-400 uppercase mb-2">AI Essay Writer</p>
          <h1 className="text-4xl font-medium text-white mb-4">The ultimate essay writer</h1>
          <p className="text-white/40 max-w-lg mx-auto">Choose your document type, writing style, citation format, and word count — then let AI do the work.</p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">

          {/* Topic */}
          <div className="card p-6">
            <label className="block text-sm text-white/60 mb-2">Essay topic or prompt</label>
            <textarea
              value={topic}
              onChange={e => setTopic(e.target.value)}
              placeholder="e.g. The impact of social media on mental health, The causes of World War 1, Why renewable energy is important..."
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/20 min-h-24 resize-y focus:outline-none focus:border-cyan-400/50 transition-colors"
            />
          </div>

          {/* Search */}
          <div className="card p-6">
            <label className="block text-sm text-white/60 mb-2">Search document types & writing styles</label>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search anything — e.g. 'narrative', 'research', 'formal'..."
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-400/50 transition-colors"
            />
          </div>

          {/* Document Type */}
          <div className="card p-6">
            <label className="block text-sm text-white/60 mb-1">Document type</label>
            <p className="text-xs text-white/20 mb-4">Selected: <span className="text-cyan-400">{docType}</span></p>
            <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
              {Object.entries(filteredDocTypes).map(([category, items]) => (
                <div key={category}>
                  <p className="text-xs font-medium text-white/30 uppercase tracking-widest mb-2">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map(item => (
                      <button key={item} onClick={() => setDocType(item)}
                        className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${docType === item
                          ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400'
                          : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(filteredDocTypes).length === 0 && (
                <p className="text-white/20 text-sm">No document types found for "{search}"</p>
              )}
            </div>
          </div>

          {/* Writing Style */}
          <div className="card p-6">
            <label className="block text-sm text-white/60 mb-1">Writing style & tone</label>
            <p className="text-xs text-white/20 mb-4">Selected: <span className="text-cyan-400">{style}</span></p>
            <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
              {Object.entries(filteredStyles).map(([category, items]) => (
                <div key={category}>
                  <p className="text-xs font-medium text-white/30 uppercase tracking-widest mb-2">{category}</p>
                  <div className="flex flex-wrap gap-2">
                    {items.map(item => (
                      <button key={item} onClick={() => setStyle(item)}
                        className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${style === item
                          ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400'
                          : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}>
                        {item}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              {Object.keys(filteredStyles).length === 0 && (
                <p className="text-white/20 text-sm">No styles found for "{search}"</p>
              )}
            </div>
          </div>

          {/* Citation Format */}
          <div className="card p-6">
            <label className="block text-sm text-white/60 mb-1">Citation format</label>
            <p className="text-xs text-white/20 mb-4">Selecting MLA 9 or APA 7 will also format the essay header correctly</p>
            <div className="flex flex-wrap gap-2">
              {citationFormats.map(fmt => (
                <button key={fmt} onClick={() => setCitation(fmt)}
                  className={`px-4 py-2 rounded-lg text-sm border transition-all ${citation === fmt
                    ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400'
                    : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}>
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Word Count */}
          <div className="card p-6">
            <label className="block text-sm text-white/60 mb-2">Word count <span className="text-white/30">(100 — 3000)</span></label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min="100"
                max="3000"
                value={wordCount}
                onChange={handleWordCountChange}
                className="w-32 bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white focus:outline-none focus:border-cyan-400/50 transition-colors"
              />
              <span className="text-white/30 text-sm">words</span>
              <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 rounded-full transition-all"
                  style={{ width: `${Math.min(((wordCount - 100) / 2900) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
            <p className="text-xs text-white/20 mt-2">Maximum 3000 words per essay</p>
          </div>

          {/* Formatting note */}
          <div className="border border-white/10 rounded-xl p-4 bg-white/5">
            <p className="text-xs text-white/40 leading-relaxed">
              <span className="text-cyan-400 font-medium">📄 Formatting note:</span> Options like double-spacing, Times New Roman, and page numbers are only available through Google Docs or Microsoft Word. To apply them: open Google Docs → Format → Line & paragraph spacing → Double. For font: select all text → choose Times New Roman, size 12.
            </p>
          </div>

          {error && <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3">{error}</p>}

          <button onClick={handleGenerate} disabled={loading}
            className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
            {loading ? 'Writing your essay…' : 'Generate Essay →'}
          </button>

          {essay && (
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                <h2 className="text-white font-medium">Your essay</h2>
                <div className="flex gap-2 flex-wrap">
                  <button onClick={() => setIsEditing(!isEditing)}
                    className={`text-sm transition-colors border px-3 py-1 rounded-lg ${isEditing
                      ? 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10'
                      : 'text-white/40 hover:text-white border-white/10 hover:border-white/20'}`}>
                    {isEditing ? '✓ Done editing' : '✏️ Edit manually'}
                  </button>
                  <button onClick={() => setShowAiEdit(!showAiEdit)}
                    className={`text-sm transition-colors border px-3 py-1 rounded-lg ${showAiEdit
                      ? 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10'
                      : 'text-white/40 hover:text-white border-white/10 hover:border-white/20'}`}>
                    ✨ AI edit ({editsRemaining} left)
                  </button>
                  <button onClick={handleCopy}
                    className={`text-sm transition-colors border px-3 py-1 rounded-lg ${copied
                      ? 'text-cyan-400 border-cyan-400/40 bg-cyan-400/10'
                      : 'text-cyan-400 hover:text-cyan-300 border-cyan-400/20'}`}>
                    {copied ? '✓ Copied!' : 'Copy →'}
                  </button>
                </div>
              </div>

              {showAiEdit && (
                <div className="mb-4 bg-white/5 border border-white/10 rounded-lg p-4">
                  <p className="text-xs text-white/40 mb-2">Tell AI what to change — be specific. ({editsRemaining} edits remaining today)</p>
                  <textarea
                    value={aiEditInstruction}
                    onChange={e => setAiEditInstruction(e.target.value)}
                    placeholder="e.g. Make the introduction more engaging, Add more evidence to paragraph 2, Make the tone less formal..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/20 min-h-16 resize-y focus:outline-none focus:border-cyan-400/50 transition-colors mb-2"
                  />
                  <button onClick={handleAiEdit} disabled={editing}
                    className="btn-primary text-sm px-4 py-2 disabled:opacity-40">
                    {editing ? 'Editing…' : 'Apply changes →'}
                  </button>
                </div>
              )}

              {isEditing ? (
                <textarea
                  value={editedEssay}
                  onChange={e => setEditedEssay(e.target.value)}
                  className="w-full bg-white/5 border border-cyan-400/30 rounded-lg p-4 text-sm text-white min-h-96 resize-y focus:outline-none transition-colors leading-relaxed font-mono"
                />
              ) : (
                <div className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">{editedEssay}</div>
              )}

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