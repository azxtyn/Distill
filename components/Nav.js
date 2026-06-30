'use client'
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'

export default function Nav() {
  const { isSignedIn } = useUser()

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
        <span className="font-medium text-gray-900">Distill</span>
      </div>
      <div className="flex items-center gap-6">
        <a href="#how" className="text-sm text-gray-500 hover:text-gray-900">How it works</a>
        <a href="#features" className="text-sm text-gray-500 hover:text-gray-900">Features</a>
        <a href="#pricing" className="text-sm text-gray-500 hover:text-gray-900">Pricing</a>

        {!isSignedIn && (
          <>
            <SignInButton mode="modal">
              <button className="text-sm text-gray-500 hover:text-gray-900">Sign in</button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-sm bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-700">Try it free</button>
            </SignUpButton>
          </>
        )}

        {isSignedIn && <UserButton afterSignOutUrl="/" />}
      </div>
    </nav>
  )
}