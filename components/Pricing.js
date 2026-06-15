'use client'
import { useState } from 'react'

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="px-6 py-20 bg-gray-50">
      <div className="text-center mb-10">
        <p className="text-xs font-medium tracking-widest text-emerald-600 uppercase mb-2">Pricing</p>
        <h2 className="text-3xl font-medium text-gray-900">Simple, honest pricing</h2>
        <p className="text-gray-500 mt-2">Start free. Upgrade when you're ready.</p>
      </div>

      <div className="flex items-center justify-center gap-3 mb-10">
        <span className={`text-sm ${!annual ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>Monthly</span>
        <button onClick={() => setAnnual(!annual)}
          className={`w-11 h-6 rounded-full border transition-colors relative ${annual ? 'bg-emerald-500 border-emerald-500' : 'bg-gray-200 border-gray-200'}`}>
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${annual ? 'left-5' : 'left-0.5'}`}></div>
        </button>
        <span className={`text-sm ${annual ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>Annual</span>
        {annual && <span className="text-xs font-medium text-emerald-700 bg-emerald-50 rounded-full px-3 py-1">Save 20%</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <p className="text-sm text-gray-500 font-medium mb-4">Free</p>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-4xl font-medium text-gray-900">$0</span>
            <span className="text-gray-400 text-sm">/month</span>
          </div>
          <p className="text-xs text-gray-400 mb-6 h-4"> </p>
          <ul className="space-y-3 mb-8 text-sm">
            <li className="flex items-center gap-2 text-gray-700"><span className="text-emerald-500">✓</span> 5 Distills per day</li>
            <li className="flex items-center gap-2 text-gray-700"><span className="text-emerald-500">✓</span> Text, URL, YouTube & PDF</li>
            <li className="flex items-center gap-2 text-gray-700"><span className="text-emerald-500">✓</span> Summary, takeaways & actions</li>
            <li className="flex items-center gap-2 text-gray-400"><span className="text-gray-300">✗</span> Quiz generation</li>
            <li className="flex items-center gap-2 text-gray-400"><span className="text-gray-300">✗</span> Priority processing</li>
            <li className="flex items-center gap-2 text-gray-400"><span className="text-gray-300">✗</span> History & saved summaries</li>
          </ul>
          <button className="w-full border border-gray-200 text-gray-900 py-2.5 rounded-lg text-sm hover:bg-gray-50">
            Get started free
          </button>
        </div>

        <div className="bg-white border-2 border-emerald-500 rounded-xl p-6 relative">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-100 text-emerald-800 text-xs font-medium px-4 py-1 rounded-full">
            Most popular
          </div>
          <p className="text-sm text-gray-500 font-medium mb-4">Pro</p>
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-4xl font-medium text-gray-900">{annual ? '$3.99' : '$4.99'}</span>
            <span className="text-gray-400 text-sm">/month</span>
          </div>
          <p className="text-xs text-gray-400 mb-6 h-4">{annual ? 'Billed as $47.90/year' : ' '}</p>
          <ul className="space-y-3 mb-8 text-sm">
            <li className="flex items-center gap-2 text-gray-700"><span className="text-emerald-500">✓</span> Unlimited Distills</li>
            <li className="flex items-center gap-2 text-gray-700"><span className="text-emerald-500">✓</span> Text, URL, YouTube & PDF</li>
            <li className="flex items-center gap-2 text-gray-700"><span className="text-emerald-500">✓</span> Summary, takeaways & actions</li>
            <li className="flex items-center gap-2 text-gray-700"><span className="text-emerald-500">✓</span> Quiz generation</li>
            <li className="flex items-center gap-2 text-gray-700"><span className="text-emerald-500">✓</span> Priority processing</li>
            <li className="flex items-center gap-2 text-gray-700"><span className="text-emerald-500">✓</span> History & saved summaries</li>
          </ul>
          <button className="w-full bg-emerald-500 text-white py-2.5 rounded-lg text-sm hover:bg-emerald-600 font-medium">
            Get Pro →
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-gray-400 mt-8">🔒 Secure checkout powered by Stripe — cancel anytime</p>
    </section>
  )
}