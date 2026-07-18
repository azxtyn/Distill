export default function Footer() {
  return (
    <footer className="px-6 py-8 border-t border-white/10">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#111827] flex items-center justify-center">
            <svg viewBox="0 0 32 32" width="18" height="18">
              <rect x="4" y="6" width="18" height="3" rx="1.5" fill="#06B6D4"/>
              <rect x="4" y="12" width="13" height="3" rx="1.5" fill="#06B6D4" opacity="0.75"/>
              <rect x="4" y="18" width="8" height="3" rx="1.5" fill="#06B6D4" opacity="0.5"/>
              <rect x="4" y="24" width="5" height="3" rx="1.5" fill="#06B6D4" opacity="0.25"/>
            </svg>
          </div>
          <span className="font-medium text-white">distill</span>
        </div>
        <div className="flex gap-6">
          <a href="/privacy" className="text-sm text-white/30 hover:text-white transition-colors">Privacy</a>
          <a href="/terms" className="text-sm text-white/30 hover:text-white transition-colors">Terms</a>
          <a href="mailto:a.b.digitalappsdev@gmail.com" className="text-sm text-white/30 hover:text-white transition-colors">Contact</a>
        </div>
      </div>
      <p className="text-xs text-white/20 mt-4">© 2026 A.B. Digital Apps. All rights reserved.</p>
    </footer>
  )
}