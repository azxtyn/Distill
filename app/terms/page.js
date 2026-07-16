export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="text-3xl font-medium text-gray-900 mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-400 mb-10">Last updated: July 13, 2026</p>

      <p className="text-gray-600 mb-8">Please read these Terms carefully before using getdistillapp.com operated by A.B. Digital Apps. By using the Service, you agree to these Terms.</p>

      <section className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-3">1. Use of the Service</h2>
        <p className="text-gray-600 mb-2">Distill is an AI-powered content summarization tool. You may use it to summarize text, articles, YouTube videos, and PDFs for personal or professional use.</p>
        <p className="text-gray-600 mb-2">You agree not to:</p>
        <ul className="list-disc pl-5 text-gray-600 space-y-1">
          <li>Use the Service for any unlawful purpose</li>
          <li>Submit content that violates third-party intellectual property rights</li>
          <li>Attempt to hack, reverse engineer, or disrupt the Service</li>
          <li>Use automated tools to abuse or overload the Service</li>
          <li>Resell or redistribute the Service without written permission</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-3">2. Accounts</h2>
        <p className="text-gray-600">You must sign in with a valid Google account to use the Service. You are responsible for all activity that occurs under your account.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-3">3. Free Tier and Subscription</h2>
        <p className="text-gray-600 mb-2"><strong>Free Tier:</strong> Free accounts are limited to 5 Distills per day, resetting at midnight UTC.</p>
        <p className="text-gray-600 mb-2"><strong>Distill Pro:</strong> Pro subscribers get unlimited Distills for $4.99/month or $47.90/year.</p>
        <p className="text-gray-600 mb-2"><strong>Billing:</strong> Payments are processed by Stripe on a recurring basis until you cancel.</p>
        <p className="text-gray-600"><strong>Cancellation:</strong> You may cancel anytime. You retain Pro access until the end of your billing period. We do not offer refunds for partial periods.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-3">4. Content You Submit</h2>
        <p className="text-gray-600">You retain ownership of content you submit. We process it solely to provide the summarization Service and do not permanently store or use it for any other purpose. You are responsible for ensuring you have the right to submit any content.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-3">5. Disclaimer of Warranties</h2>
        <p className="text-gray-600">The Service is provided "as is" without warranties of any kind. AI-generated summaries may contain errors and should not be relied upon as a substitute for reading original source material.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-3">6. Limitation of Liability</h2>
        <p className="text-gray-600">To the fullest extent permitted by law, A.B. Digital Apps shall not be liable for any indirect, incidental, or consequential damages arising from your use of the Service.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-3">7. Governing Law</h2>
        <p className="text-gray-600">These Terms are governed by the laws of the State of Maryland, United States.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-medium text-gray-900 mb-3">8. Contact Us</h2>
        <p className="text-gray-600">If you have questions about these Terms, contact us at:</p>
        <p className="text-gray-600 mt-2"><strong>A.B. Digital Apps</strong><br />Email: a.b.digitalappsdev@gmail.com<br />Website: getdistillapp.com</p>
      </section>
    </div>
  )
}