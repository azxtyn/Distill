'use client'
import { useState, useEffect } from 'react'
import { useUser, SignUpButton } from '@clerk/nextjs'

export default function Pricing() {
  const [annual, setAnnual] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isPro, setIsPro] = useState(false)
  const [checkingStatus, setCheckingStatus] = useState(true)
  const { isSignedIn } = useUser()

  useEffect(() => {
    if (isSignedIn) {
      fetch('/api/subscription-status')
        .then(res => res.json())
        .then(data => setIsPro(data.isPro))
        .catch(() => setIsPro(false))
        .finally(() => setCheckingStatus(false))
    } else {
      setCheckingStatus(false)
    }
  }, [isSignedIn])

  const handleCheckout = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: annual ? 'yearly' : 'monthly' })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        alert(data.error || 'Something went wrong.')
      }
    } catch (e) {
      alert('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <section id="pricing" className="px-6 py-20">
      <div className="text-center mb-10">
        <p className="text-xs font-medium tracking-widest text-cyan-400 uppercase mb-2">Pricing</p>
        <h2 className="text-3xl font-medium text-white">Simple, honest pricing</h2>
        <p className="text-white/40 mt-2">Start free. Upgrade when you're ready.</p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm ${!annual ? 'text-white font-medium' : 'text-white/40'}`}>Monthly</span>
        <button onClick={() => setAnnual(!annual)}
          className={`w-11 h-6 rounded-full border transition-colors relative ${annual ? 'bg-cyan-400 border-cyan-400' : 'bg-white/10 border-white/20'}`}>
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${annual ? 'left-5' : 'left-0.5'}`}></div>
        </button>
        <span className={`text-sm ${annual ? 'text-white font-medium' : 'text-white/40'}`}>Annual</span>
        {annual && <span className="text-xs font-medium text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-3 py-1">Save 20%</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <div className="card p-6">
          <p className="text-sm text-white/40 font-medium mb-4">Free</p>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-4xl font-medium text-white">$0</span>
            <span className="text-white/40 text-sm">/month</span>
          </div>
          <p className="text-xs text-white/20 mb-6 h-4"> </p>
          <ul className="space-y-3 mb-8 text-sm">
            <li className="flex items-center gap-2 text-white/70"><span className="text-cyan-400">✓</span> 5 Distills per day</li>
            <li className="flex items-center gap-2 text-white/70"><span className="text-cyan-400">✓</span> Text, URL, YouTube & PDF</li>
            <li className="flex items-center gap-2 text-white/70"><span className="text-cyan-400">✓</span> Summary, takeaways & actions</li>
            <li className="flex items-center gap-2 text-white/20"><span className="text-white/20">✗</span> Quiz generation</li>
            <li className="flex items-center gap-2 text-white/20"><span className="text-white/20">✗</span> Priority processing</li>
            <li className="flex items-center gap-2 text-white/20"><span className="text-white/20">✗</span> History & saved summaries</li>
          </ul>
          {!isSignedIn ? (
            <SignUpButton mode="modal">
              <button className="btn-secondary w-full">Get started free</button>
            </SignUpButton>
          ) : (
            <button disabled className="w-full py-2.5 rounded-lg text-sm text-white/20 border border-white/10">
              {isPro ? 'Free plan' : 'Current plan'}
            </button>
          )}
        </div>

        <div className="card p-6 border-cyan-400/30 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-cyan-400 text-black text-xs font-medium px-4 py-1 rounded-full">
            Most popular
          </div>
          <p className="text-sm text-white/40 font-medium mb-4 mt-2">Pro</p>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-4xl font-medium text-white">{annual ? '$3.99' : '$4.99'}</span>
            <span className="text-white/40 text-sm">/month</span>
          </div>
          <p className="text-xs text-white/30 mb-6 h-4">{annual ? 'Billed as $47.90/year' : ' '}</p>
          <ul className="space-y-3 mb-8 text-sm">
            <li className="flex items-center gap-2 text-white/70"><span className="text-cyan-400">✓</span> Unlimited Distills</li>
            <li className="flex items-center gap-2 text-white/70"><span className="text-cyan-400">✓</span> Text, URL, YouTube & PDF</li>
            <li className="flex items-center gap-2 text-white/70"><span className="text-cyan-400">✓</span> Summary, takeaways & actions</li>
            <li className="flex items-center gap-2 text-white/70"><span className="text-cyan-400">✓</span> Quiz generation</li>
            <li className="flex items-center gap-2 text-white/70"><span className="text-cyan-400">✓</span> Priority processing</li>
            <li className="flex items-center gap-2 text-white/70"><span className="text-cyan-400">✓</span> History & saved summaries</li>
          </ul>
          {!isSignedIn ? (
            <SignUpButton mode="modal">
              <button className="btn-primary w-full">Get Pro →</button>
            </SignUpButton>
          ) : isPro ? (
            <button disabled className="w-full py-2.5 rounded-lg text-sm bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
              ✓ Current plan
            </button>
          ) : (
            <button onClick={handleCheckout} disabled={loading || checkingStatus} className="btn-primary w-full disabled:opacity-50">
              {loading ? 'Loading...' : 'Get Pro →'}
            </button>
          )}
        </div>
      </div>
      <p className="text-center text-xs text-white/20 mt-8">🔒 Secure checkout powered by Stripe — cancel anytime</p>
    </section>
  )
}