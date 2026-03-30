import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
})

function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <h1 className="font-display text-5xl font-semibold mb-8">Terms & Conditions</h1>
      <p className="text-taupe leading-relaxed">
        Terms and conditions content coming soon.
      </p>
    </div>
  )
}
