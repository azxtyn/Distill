export default function HowItWorks() {
  return (
    <section id="how" className="px-6 py-20">
      <div className="text-center mb-12">
        <p className="text-xs font-medium tracking-widest text-cyan-400 uppercase mb-2">How it works</p>
        <h2 className="text-3xl font-medium text-white">Three steps, seconds to insight</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="card p-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-4">
            <span className="text-cyan-400 font-medium text-sm">01</span>
          </div>
          <h3 className="font-medium text-white mb-2">Drop your content</h3>
          <p className="text-sm text-white/40 leading-relaxed">Paste text, a URL, a YouTube link, or upload a PDF — any format works.</p>
        </div>
        <div className="card p-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-4">
            <span className="text-cyan-400 font-medium text-sm">02</span>
          </div>
          <h3 className="font-medium text-white mb-2">AI does the work</h3>
          <p className="text-sm text-white/40 leading-relaxed">Distill reads, analyzes, and extracts what actually matters in seconds.</p>
        </div>
        <div className="card p-6">
          <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mb-4">
            <span className="text-cyan-400 font-medium text-sm">03</span>
          </div>
          <h3 className="font-medium text-white mb-2">Get the essentials</h3>
          <p className="text-sm text-white/40 leading-relaxed">Summary, takeaways, action items, and an optional quiz — ready to use.</p>
        </div>
      </div>
    </section>
  )
}