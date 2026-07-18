export default function Testimonials() {
  return (
    <section className="px-6 py-20 text-center">
      <div className="max-w-2xl mx-auto card p-12">
        <div className="w-12 h-12 rounded-xl bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center mx-auto mb-6">
          <span className="text-2xl">🚀</span>
        </div>
        <p className="text-xs font-medium tracking-widest text-cyan-400 uppercase mb-3">Early access</p>
        <h2 className="text-3xl font-medium text-white mb-4">Be the first to experience Distill</h2>
        <p className="text-white/40 mb-8 leading-relaxed">We're just getting started. Join the first wave of students, professionals, and curious minds using Distill to learn faster every day.</p>
        <a href="#app" className="btn-primary inline-block">Try it free — no credit card needed</a>
      </div>
    </section>
  )
}