'use client'
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

export default function Nav() {
  const { isSignedIn } = useUser()

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 z-50 backdrop-blur-md bg-black/60">
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
      <div className="flex items-center gap-6">
        <a href="#how" className="text-sm text-white/50 hover:text-white transition-colors">How it works</a>
        <a href="#features" className="text-sm text-white/50 hover:text-white transition-colors">Features</a>
        <a href="#pricing" className="text-sm text-white/50 hover:text-white transition-colors">Pricing</a>

        {!isSignedIn && (
          <>
            <SignInButton mode="modal">
              <button className="text-sm text-white/50 hover:text-white transition-colors">Sign in</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="btn-primary text-sm px-4 py-2">Try it free</button>
            </SignUpButton>
          </>
        )}

        {isSignedIn && <UserButton afterSignOutUrl="/" />}
      </div>
    </nav>
  )
}