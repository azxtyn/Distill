export default function HowItWorks() {
  return (
    <section id="how" className="px-6 py-20 bg-gray-50">
      <div className="text-center mb-12">
        <p className="text-xs font-medium tracking-widest text-emerald-600 uppercase mb-2">How it works</p>
        <h2 className="text-3xl font-medium text-gray-900">Three steps, seconds to insight</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <p className="text-xs font-medium text-emerald-600 mb-3">Step 1</p>
          <div className="text-2xl mb-3">📄</div>
          <h3 className="font-medium text-gray-900 mb-2">Drop your content</h3>
          <p className="text-sm text-gray-500 leading-relaxed">Paste text, a URL, a YouTube link, or upload a PDF — any format works.</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <p className="text-xs font-medium text-emerald-600 mb-3">Step 2</p>
          <div className="text-2xl mb-3">⚡</div>
          <h3 className="font-medium text-gray-900 mb-2">AI does the work</h3>
          <p className="text-sm text-gray-500 leading-relaxed">Distill reads, analyzes, and extracts what actually matters in seconds.</p>
        </div>
        <div className="bg-white border border-gray-100 rounded-xl p-6">
          <p className="text-xs font-medium text-emerald-600 mb-3">Step 3</p>
          <div className="text-2xl mb-3">💡</div>
          <h3 className="font-medium text-gray-900 mb-2">Get the essentials</h3>
          <p className="text-sm text-gray-500 leading-relaxed">Summary, takeaways, action items, and an optional quiz — ready to use.</p>
        </div>
      </div>
    </section>
  )
}