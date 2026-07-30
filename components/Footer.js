'use client'
import { useState } from 'react'

export default function Footer() {
  const [modal, setModal] = useState(null)

  return (
    <>
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
            <button onClick={() => setModal('privacy')} className="text-sm text-white/30 hover:text-white transition-colors">Privacy</button>
            <button onClick={() => setModal('terms')} className="text-sm text-white/30 hover:text-white transition-colors">Terms</button>
            <button onClick={() => setModal('contact')} className="text-sm text-white/30 hover:text-white transition-colors">Contact</button>
          </div>
        </div>
        <p className="text-xs text-white/20 mt-4">© 2026 A.B. Digital Apps. All rights reserved.</p>
        <p className="text-xs text-white/20 mt-1">By using Distill you agree to our <button onClick={() => setModal('terms')} className="underline hover:text-white/40 transition-colors">Terms of Service</button> and <button onClick={() => setModal('privacy')} className="underline hover:text-white/40 transition-colors">Privacy Policy</button>.</p>
      </footer>

      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setModal(null)}>
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
          <div className="relative bg-[#111111] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-medium text-white">
                {modal === 'privacy' ? 'Privacy Policy' : modal === 'terms' ? 'Terms of Service' : 'Contact Us'}
              </h2>
              <button onClick={() => setModal(null)} className="text-white/40 hover:text-white transition-colors text-xl">✕</button>
            </div>

            {modal === 'privacy' && (
              <div className="text-white/60 text-sm leading-relaxed space-y-4">
                <p className="text-white/30 text-xs">Last updated: July 13, 2026</p>
                <p>A.B. Digital Apps ("we", "us", or "our") operates getdistillapp.com. This page explains what information we collect, how we use it, and your rights.</p>
                <div><h3 className="text-white font-medium mb-2">1. Information We Collect</h3>
                <p><strong className="text-white/80">Account Information:</strong> When you sign up, we collect your name and email through Google Sign-In via Clerk. We do not store your Google password.</p>
                <p className="mt-2"><strong className="text-white/80">Usage Data:</strong> We track how many Distills you use per day to enforce free tier limits.</p>
                <p className="mt-2"><strong className="text-white/80">Payment Information:</strong> Payments are processed by Stripe. We never store your card details on our servers.</p>
                <p className="mt-2"><strong className="text-white/80">Content You Submit:</strong> Text, URLs, YouTube links, and PDFs you submit are sent to Anthropic's API for processing. We do not permanently store your submitted content.</p></div>
                <div><h3 className="text-white font-medium mb-2">2. How We Use Your Information</h3>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Provide and operate the Service</li>
                  <li>Track daily usage and enforce free tier limits</li>
                  <li>Process payments and manage subscriptions</li>
                  <li>Send important account or service updates</li>
                  <li>Respond to support requests</li>
                </ul></div>
                <div><h3 className="text-white font-medium mb-2">3. Third-Party Services</h3>
                <ul className="list-disc pl-4 space-y-1">
                  <li><strong className="text-white/80">Clerk</strong> — Authentication</li>
                  <li><strong className="text-white/80">Stripe</strong> — Payment processing</li>
                  <li><strong className="text-white/80">Supabase</strong> — Database</li>
                  <li><strong className="text-white/80">Anthropic</strong> — AI summarization</li>
                  <li><strong className="text-white/80">Vercel</strong> — Hosting</li>
                </ul></div>
                <div><h3 className="text-white font-medium mb-2">4. Contact Us</h3>
                <p>A.B. Digital Apps — a.b.digitalappsdev@gmail.com — getdistillapp.com</p></div>
              </div>
            )}

            {modal === 'terms' && (
              <div className="text-white/60 text-sm leading-relaxed space-y-4">
                <p className="text-white/30 text-xs">Last updated: July 13, 2026</p>
                <p>By using getdistillapp.com you agree to these Terms of Service operated by A.B. Digital Apps.</p>
                <div><h3 className="text-white font-medium mb-2">1. Use of the Service</h3>
                <p>Distill is an AI-powered content summarization tool. You may not use it for unlawful purposes, submit content that violates third-party rights, or attempt to hack or disrupt the Service.</p></div>
                <div><h3 className="text-white font-medium mb-2">2. Free Tier and Subscription</h3>
                <p><strong className="text-white/80">Free Tier:</strong> 5 Distills per day, resetting at midnight UTC.</p>
                <p className="mt-2"><strong className="text-white/80">Distill Pro:</strong> Unlimited Distills for $4.99/month or $47.90/year.</p>
                <p className="mt-2"><strong className="text-white/80">Cancellation:</strong> Cancel anytime. You retain Pro access until the end of your billing period. No refunds for partial periods.</p></div>
                <div><h3 className="text-white font-medium mb-2">3. Content You Submit</h3>
                <p>You retain ownership of content you submit. We process it solely to provide the summarization Service and do not permanently store it.</p></div>
                <div><h3 className="text-white font-medium mb-2">4. Disclaimer</h3>
                <p>The Service is provided "as is". AI-generated summaries may contain errors and should not replace reading original source material.</p></div>
                <div><h3 className="text-white font-medium mb-2">5. Governing Law</h3>
                <p>These Terms are governed by the laws of the State of Maryland, United States.</p></div>
                <div><h3 className="text-white font-medium mb-2">6. Contact Us</h3>
                <p>A.B. Digital Apps — a.b.digitalappsdev@gmail.com — getdistillapp.com</p></div>
              </div>
            )}

            {modal === 'contact' && (
              <div className="text-white/60 text-sm leading-relaxed space-y-4">
                <p>Have a question, feedback, or issue? We'd love to hear from you!</p>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-white font-medium mb-1">A.B. Digital Apps</p>
                  <p>Email: <a href="mailto:a.b.digitalappsdev@gmail.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">a.b.digitalappsdev@gmail.com</a></p>
                  <p className="mt-1">Website: getdistillapp.com</p>
                </div>
                <p className="text-white/40 text-xs">We typically respond within 24-48 hours.</p>
              </div>
            )}

            <button onClick={() => setModal(null)} className="mt-6 btn-primary w-full">Got it</button>
          </div>
        </div>
      )}
    </>
  )
}