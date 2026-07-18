'use client'

export default function Hero() {
  return (
    <section className="text-center px-6 py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.08)_0%,transparent_70%)] pointer-events-none"></div>
      
      <div className="relative z-10 animate-fade-in">
        <div className="inline-flex items-center gap-2 text-sm text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 rounded-full px-4 py-1.5 mb-8 font-medium">
          ✦ Powered by AI
        </div>
        <h1 className="text-5xl md:text-6xl font-medium text-white leading-tight max-w-3xl mx-auto mb-6">
          Stop drowning in content.<br />
          <span className="text-cyan-400">Start learning faster.</span>
        </h1>
        <p className="text-xl text-white/50 max-w-xl mx-auto mb-10 leading-relaxed">
          Paste any video, article, or PDF and get a 1-minute summary, key takeaways, action items, and a quiz — in seconds.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <a href="#app" className="btn-primary glow">Try Distill free</a>
          <a href="#how" className="btn-secondary">See how it works</a>
        </div>
        <div className="flex gap-8 justify-center mt-12 flex-wrap">
          <span className="text-sm text-white/30">✓ 12,000+ learners</span>
          <span className="text-sm text-white/30">✓ 200k+ summaries created</span>
          <span className="text-sm text-white/30">✓ Avg. 18 min saved per use</span>
        </div>
      </div>
    </section>
  )
}