export default function Footer() {
  return (
    <footer className="px-6 py-8 border-t border-gray-100">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="font-medium text-gray-900">Distill</span>
        </div>
        <div className="flex gap-6">
          <a href="/privacy" className="text-sm text-gray-400 hover:text-gray-600">Privacy</a>
          <a href="/terms" className="text-sm text-gray-400 hover:text-gray-600">Terms</a>
          <a href="mailto:a.b.digitalappsdev@gmail.com" className="text-sm text-gray-400 hover:text-gray-600">Contact</a>
        </div>
      </div>
      <p className="text-xs text-gray-300 mt-4">© 2026 A.B. Digital Apps. All rights reserved.</p>
    </footer>
  )
}