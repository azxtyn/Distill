export default function Features() {
  const features = [
    { icon: '⏱', title: '1-minute summaries', desc: 'Get the full picture without reading the whole thing.' },
    { icon: '✅', title: 'Action items', desc: 'Turn content into a concrete to-do list automatically.' },
    { icon: '🎓', title: 'Built-in quizzes', desc: 'Test your understanding with AI-generated questions.' },
    { icon: '▶️', title: 'YouTube support', desc: 'Summarize any video via transcript — no watching needed.' },
    { icon: '📄', title: 'PDF uploads', desc: 'Drop in research papers, reports, or ebooks instantly.' },
    { icon: '🌐', title: 'URL extraction', desc: 'Paste any article link and we\'ll handle the rest.' },
  ]

  return (
    <section id="features" className="px-6 py-20">
      <div className="text-center mb-12">
        <p className="text-xs font-medium tracking-widest text-cyan-400 uppercase mb-2">Features</p>
        <h2 className="text-3xl font-medium text-white">Everything you need to learn smarter</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {features.map((f, i) => (
          <div key={i} className="card p-6">
            <div className="text-2xl mb-3">{f.icon}</div>
            <h3 className="font-medium text-white mb-2">{f.title}</h3>
            <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}