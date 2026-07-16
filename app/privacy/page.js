export default function Privacy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-medium text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: July 13, 2026</p>

      <p className="text-gray-600 mb-8">A.B. Digital Apps ("we", "us", or "our") operates getdistillapp.com. This page explains what information we collect, how we use it, and your rights.</p>

      <section className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-3">1. Information We Collect</h2>
        <p className="text-gray-600 mb-2"><strong>Account Information:</strong> When you sign up, we collect your name and email through Google Sign-In via Clerk. We do not store your Google password.</p>
        <p className="text-gray-600 mb-2"><strong>Usage Data:</strong> We track how many Distills you use per day to enforce free tier limits.</p>
        <p className="text-gray-600 mb-2"><strong>Payment Information:</strong> Payments are processed by Stripe. We never store your card details on our servers.</p>
        <p className="text-gray-600"><strong>Content You Submit:</strong> Text, URLs, YouTube links, and PDFs you submit are sent to Anthropic's API for processing. We do not permanently store your submitted content.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-3">2. How We Use Your Information</h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-1">
          <li>Provide and operate the Service</li>
          <li>Track daily usage and enforce free tier limits</li>
          <li>Process payments and manage subscriptions</li>
          <li>Send important account or service updates</li>
          <li>Respond to support requests</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-3">3. Third-Party Services</h2>
        <ul className="list-disc pl-5 text-gray-600 space-y-1">
          <li><strong>Clerk</strong> — Authentication (clerk.com)</li>
          <li><strong>Stripe</strong> — Payment processing (stripe.com)</li>
          <li><strong>Supabase</strong> — Database (supabase.com)</li>
          <li><strong>Anthropic</strong> — AI summarization (anthropic.com)</li>
          <li><strong>Vercel</strong> — Hosting (vercel.com)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-3">4. Data Sharing</h2>
        <p className="text-gray-600">We do not sell, rent, or share your personal information with third parties except as necessary to provide the Service or as required by law.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-3">5. Security</h2>
        <p className="text-gray-600">All data is transmitted over HTTPS. Payment data is handled entirely by Stripe and never stored on our servers.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-3">6. Children's Privacy</h2>
        <p className="text-gray-600">Distill is not directed at children under 13. We do not knowingly collect personal information from children under 13.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-3">7. Contact Us</h2>
        <p className="text-gray-600">If you have any questions about this Privacy Policy, contact us at:</p>
        <p className="text-gray-600 mt-2"><strong>A.B. Digital Apps</strong><br />Email: a.b.digitalappsdev@gmail.com<br />Website: getdistillapp.com</p>
      </section>
    </div>
  )
}