'use client'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import Footer from '@/components/Footer'

export default function Flashcards() {
  const [decks, setDecks] = useState([])
  const [activeDeck, setActiveDeck] = useState(null)
  const [view, setView] = useState('home')
  const [deckName, setDeckName] = useState('')
  const [cards, setCards] = useState([{ question: '', answer: '' }])
  const [currentCard, setCurrentCard] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [aiTopic, setAiTopic] = useState('')
  const [aiCount, setAiCount] = useState(10)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [isPro, setIsPro] = useState(false)
  const [checkingPro, setCheckingPro] = useState(true)
  const { isSignedIn } = useUser()

  useEffect(() => {
    if (isSignedIn) {
      fetch('/api/subscription-status')
        .then(res => res.json())
        .then(data => {
          setIsPro(data.isPro)
          setCheckingPro(false)
          loadDecks()
        })
        .catch(() => setCheckingPro(false))
    } else {
      setCheckingPro(false)
    }
  }, [isSignedIn])

  const loadDecks = async () => {
    try {
      const res = await fetch('/api/flashcards')
      const data = await res.json()
      if (data.decks) setDecks(data.decks)
    } catch (e) {
      console.error('Failed to load decks')
    }
  }

  const addCard = () => setCards([...cards, { question: '', answer: '' }])

  const updateCard = (index, field, value) => {
    const updated = [...cards]
    updated[index][field] = value
    setCards(updated)
  }

  const removeCard = (index) => {
    if (cards.length === 1) return
    setCards(cards.filter((_, i) => i !== index))
  }

  const saveDeck = async () => {
    if (!deckName.trim()) { setError('Please enter a deck name.'); return }
    const validCards = cards.filter(c => c.question.trim() && c.answer.trim())
    if (validCards.length === 0) { setError('Please add at least one complete card.'); return }

    if (!isSignedIn) {
      setActiveDeck({ name: deckName, cards: validCards })
      setView('study')
      setCurrentCard(0)
      setFlipped(false)
      return
    }

    setSaving(true)
    try {
      const res = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deckName, cards: validCards })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to save')
      await loadDecks()
      setView('home')
      setDeckName('')
      setCards([{ question: '', answer: '' }])
    } catch (e) {
      setError(e.message)
    }
    setSaving(false)
  }

  const generateAI = async () => {
    if (!aiTopic.trim()) { setError('Please enter a topic or paste your notes.'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/flashcards/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic, count: aiCount })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to generate')
      setCards(data.cards)
      setView('create')
      setDeckName(aiTopic.slice(0, 40))
    } catch (e) {
      setError(e.message)
    }
    setLoading(false)
  }

  const startStudy = (deck) => {
    setActiveDeck(deck)
    setCurrentCard(0)
    setFlipped(false)
    setView('study')
  }

  const deleteDeck = async (id) => {
    try {
      await fetch(`/api/flashcards?id=${id}`, { method: 'DELETE' })
      await loadDecks()
    } catch (e) {
      console.error('Failed to delete deck')
    }
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
        <div className="max-w-3xl mx-auto">

          {view === 'home' && (
            <>
              <div className="text-center mb-10">
                <p className="text-xs font-medium tracking-widest text-cyan-400 uppercase mb-2">Flashcards</p>
                <h1 className="text-4xl font-medium text-white mb-4">Study smarter</h1>
                <p className="text-white/40 max-w-md mx-auto">Create flashcard decks manually or let AI generate them for you.</p>
              </div>

              {!isSignedIn && (
                <div className="card p-6 text-center mb-6">
                  <p className="text-white/60 mb-4">Sign in to create and study flashcards</p>
                  <a href="/" className="btn-primary inline-block">Sign in →</a>
                </div>
              )}

              {isSignedIn && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <button onClick={() => { setView('create'); setCards([{ question: '', answer: '' }]); setDeckName(''); setError('') }}
                      className="card p-6 text-left hover:border-cyan-400/30 transition-all">
                      <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-4">
                        <span className="text-cyan-400 text-lg">✏️</span>
                      </div>
                      <h3 className="text-white font-medium mb-1">Create manually</h3>
                      <p className="text-white/40 text-sm">Write your own questions and answers. Free for everyone.</p>
                    </button>

                    <button onClick={() => { if (isPro) { setView('ai'); setError('') } }}
                      className={`card p-6 text-left transition-all ${isPro ? 'hover:border-cyan-400/30 cursor-pointer' : 'opacity-60 cursor-not-allowed'}`}>
                      <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-4">
                        <span className="text-cyan-400 text-lg">✨</span>
                      </div>
                      <h3 className="text-white font-medium mb-1">Generate with AI</h3>
                      <p className="text-white/40 text-sm">Paste a topic or notes and AI creates the cards for you.</p>
                      {!isPro && <p className="text-cyan-400/60 text-xs mt-2">🔒 Pro only — upgrade to unlock</p>}
                    </button>
                  </div>

                  {decks.length > 0 && (
                    <div>
                      <h2 className="text-white font-medium mb-4">Your decks</h2>
                      <div className="space-y-3">
                        {decks.map(deck => (
                          <div key={deck.id} className="card p-4 flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">{deck.deck_name}</p>
                              <p className="text-white/40 text-sm">{deck.cards.length} cards</p>
                            </div>
                            <div className="flex gap-2">
                              <button onClick={() => startStudy({ name: deck.deck_name, cards: deck.cards })}
                                className="btn-primary px-4 py-2 text-sm">Study</button>
                              <button onClick={() => deleteDeck(deck.id)}
                                className="px-4 py-2 text-sm border border-white/10 text-white/40 hover:text-red-400 hover:border-red-400/20 rounded-lg transition-all">Delete</button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {decks.length === 0 && (
                    <div className="card p-8 text-center">
                      <p className="text-white/40">No saved decks yet. Create your first one above!</p>
                    </div>
                  )}
                </>
              )}
            </>
          )}

          {view === 'create' && (
            <>
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setView('home')} className="text-white/40 hover:text-white transition-colors">← Back</button>
                <h2 className="text-2xl font-medium text-white">Create flashcard deck</h2>
              </div>

              {error && <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3 mb-4">{error}</p>}

              <div className="card p-6 mb-6">
                <label className="block text-sm text-white/60 mb-2">Deck name</label>
                <input value={deckName} onChange={e => setDeckName(e.target.value)}
                  placeholder="e.g. Biology Chapter 5, Spanish Vocab, History Dates..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-cyan-400/50 transition-colors" />
              </div>

              <div className="space-y-4 mb-6">
                {cards.map((card, i) => (
                  <div key={i} className="card p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-white/40 text-sm">Card {i + 1}</span>
                      {cards.length > 1 && (
                        <button onClick={() => removeCard(i)} className="text-white/20 hover:text-red-400 transition-colors text-sm">Remove</button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-white/40 mb-1">Question / Term</label>
                        <textarea value={card.question} onChange={e => updateCard(i, 'question', e.target.value)}
                          placeholder="Enter question or term..."
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/20 min-h-20 resize-y focus:outline-none focus:border-cyan-400/50 transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs text-white/40 mb-1">Answer / Definition</label>
                        <textarea value={card.answer} onChange={e => updateCard(i, 'answer', e.target.value)}
                          placeholder="Enter answer or definition..."
                          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/20 min-h-20 resize-y focus:outline-none focus:border-cyan-400/50 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={addCard} className="btn-secondary flex-1">+ Add card</button>
                <button onClick={saveDeck} disabled={saving}
                  className="btn-primary flex-1 disabled:opacity-40">
                  {saving ? 'Saving...' : 'Save deck →'}
                </button>
              </div>
            </>
          )}

          {view === 'ai' && (
            <>
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setView('home')} className="text-white/40 hover:text-white transition-colors">← Back</button>
                <h2 className="text-2xl font-medium text-white">Generate with AI</h2>
              </div>

              {error && <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg p-3 mb-4">{error}</p>}

              <div className="card p-6 mb-6">
                <label className="block text-sm text-white/60 mb-2">Topic or paste your notes</label>
                <textarea value={aiTopic} onChange={e => setAiTopic(e.target.value)}
                  placeholder="e.g. 'The American Civil War' or paste your class notes here..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-white/20 min-h-32 resize-y focus:outline-none focus:border-cyan-400/50 transition-colors" />
              </div>

              <div className="card p-6 mb-6">
                <label className="block text-sm text-white/60 mb-2">Number of cards to generate</label>
                <div className="flex gap-2 flex-wrap">
                  {[5, 10, 15, 20, 25].map(n => (
                    <button key={n} onClick={() => setAiCount(n)}
                      className={`px-4 py-2 rounded-lg text-sm border transition-all ${aiCount === n
                        ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400'
                        : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'}`}>
                      {n} cards
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={generateAI} disabled={loading}
                className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">
                {loading ? 'Generating cards…' : 'Generate flashcards →'}
              </button>
            </>
          )}

          {view === 'study' && activeDeck && (
            <>
              <div className="flex items-center gap-4 mb-8">
                <button onClick={() => setView('home')} className="text-white/40 hover:text-white transition-colors">← Back</button>
                <h2 className="text-2xl font-medium text-white">{activeDeck.name}</h2>
                <span className="text-white/30 text-sm">{currentCard + 1} / {activeDeck.cards.length}</span>
              </div>

              <div className="mb-6">
                <div className="w-full bg-white/10 rounded-full h-1 mb-6">
                  <div className="bg-cyan-400 h-1 rounded-full transition-all"
                    style={{ width: `${((currentCard + 1) / activeDeck.cards.length) * 100}%` }}></div>
                </div>

                <div onClick={() => setFlipped(!flipped)}
                  className="card p-8 min-h-64 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400/30 transition-all text-center">
                  <p className="text-xs text-white/30 uppercase tracking-widest mb-4">
                    {flipped ? 'Answer' : 'Question'} — click to flip
                  </p>
                  <p className="text-white text-xl leading-relaxed">
                    {flipped ? activeDeck.cards[currentCard].answer : activeDeck.cards[currentCard].question}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setCurrentCard(Math.max(0, currentCard - 1)); setFlipped(false) }}
                  disabled={currentCard === 0}
                  className="btn-secondary flex-1 disabled:opacity-30">← Previous</button>
                {currentCard < activeDeck.cards.length - 1 ? (
                  <button onClick={() => { setCurrentCard(currentCard + 1); setFlipped(false) }}
                    className="btn-primary flex-1">Next →</button>
                ) : (
                  <button onClick={() => { setCurrentCard(0); setFlipped(false) }}
                    className="btn-primary flex-1">Restart 🔄</button>
                )}
              </div>

              <p className="text-center text-white/20 text-sm mt-4">Click the card to flip between question and answer</p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}