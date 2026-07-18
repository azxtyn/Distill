export default function CTA() {
  return (
    <section className="px-6 py-20 text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.06)_0%,transparent_70%)] pointer-events-none"></div>
      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="text-4xl font-medium text-white mb-4">Ready to stop wasting time?</h2>
        <p className="text-white/40 mb-8 text-lg">Join thousands of students, professionals, and curious minds using Distill every day.</p>
        <a href="#app" className="btn-primary glow inline-block">
          Start summarizing — it's free
        </a>
      </div>
    </section>
  )
}