export default function Testimonials() {
  const testimonials = [
    { name: 'Sarah K.', role: 'PhD student', quote: 'I went from spending 2 hours on research papers to 10 minutes. Distill is a game changer for grad school.' },
    { name: 'Marcus T.', role: 'Product manager', quote: 'My team uses it to stay on top of industry news without burning out. The action items feature is brilliant.' },
    { name: 'Priya M.', role: 'College student', quote: 'The quiz feature actually helped me retain what I learned. It\'s like having a study partner on demand.' },
  ]

  return (
    <section className="px-6 py-20">
      <div className="text-center mb-12">
        <p className="text-xs font-medium tracking-widest text-emerald-600 uppercase mb-2">Loved by learners</p>
        <h2 className="text-3xl font-medium text-gray-900">What people are saying</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {testimonials.map((t, i) => (
          <div key={i} className="bg-white border border-gray-100 rounded-xl p-6">
            <div className="text-yellow-400 mb-3">★★★★★</div>
            <p className="text-sm text-gray-600 leading-relaxed italic mb-4">"{t.quote}"</p>
            <div>
              <p className="text-sm font-medium text-gray-900">{t.name}</p>
              <p className="text-xs text-gray-400">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}