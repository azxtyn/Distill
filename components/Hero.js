'use client'

export default function Hero() {
  return (
    <section className="text-center px-6 py-20">
      <div className="inline-flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 rounded-full px-4 py-1 mb-6 font-medium">
        ✦ Powered by AI
      </div>
      <h1 className="text-5xl font-medium text-gray-900 leading-tight max-w-2xl mx-auto mb-6">
        Stop drowning in content. Start learning faster.
      </h1>
      <p className="text-xl text-gray-500 max-w-xl mx-auto mb-10 leading-relaxed">
        Paste any video, article, or PDF and get a 1-minute summary, key takeaways, action items, and a quiz — in seconds.
      </p>
      <div className="flex gap-3 justify-center flex-wrap">
        <a href="#app" className="bg-gray-900 text-white px-7 py-3 rounded-lg text-base hover:bg-gray-700">
          Try Distill free
        </a>
        <a href="#how" className="border border-gray-200 text-gray-900 px-7 py-3 rounded-lg text-base hover:bg-gray-50">
          See how it works
        </a>
      </div>
      <div className="flex gap-8 justify-center mt-12 flex-wrap">
        <span className="text-sm text-gray-400">✓ 12,000+ learners</span>
        <span className="text-sm text-gray-400">✓ 200k+ summaries created</span>
        <span className="text-sm text-gray-400">✓ Avg. 18 min saved per use</span>
      </div>
    </section>
  )
}