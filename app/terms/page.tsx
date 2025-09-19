import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, FileText, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back Button */}
          <div className="mb-6">
            <Button variant="outline" asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>

          {/* Header */}
          <Card className="mb-8">
            <CardHeader className="text-center">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-fit mx-auto mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <CardTitle className="text-3xl">Terms of Service</CardTitle>
              <CardDescription>
                Last updated: September 11, 2024
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Content */}
          <Card>
            <CardContent className="prose max-w-none pt-6">
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing and using tykoonConnect (&quot;the Platform&quot;, &quot;our Service&quot;), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                tykoonConnect is a 100% free marketplace platform that connects clients with freelancers. We provide:
              </p>
              <ul>
                <li>Job posting and browsing capabilities</li>
                <li>Proposal submission and management</li>
                <li>Three payment assurance methods (Milestone Invoice, External Escrow, Card Hold)</li>
                <li>Communication tools between parties</li>
                <li>Project management features</li>
              </ul>

              <h2>3. Zero Platform Fees</h2>
              <p>
                tykoonConnect charges zero platform fees, commissions, or subscription costs. Our service is sustained through voluntary donations from community members. We will never charge fees for:
              </p>
              <ul>
                <li>Job postings or browsing</li>
                <li>Proposal submissions</li>
                <li>Project communications</li>
                <li>Basic platform features</li>
              </ul>

              <h2>4. User Accounts</h2>
              <p>
                Users must provide accurate, current, and complete information during registration. You are responsible for safeguarding your account credentials and for all activities that occur under your account.
              </p>

              <h2>5. Acceptable Use</h2>
              <p>You agree not to use the Platform to:</p>
              <ul>
                <li>Post fraudulent, misleading, or illegal content</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Violate intellectual property rights</li>
                <li>Spam or send unsolicited communications</li>
                <li>Attempt to circumvent platform security measures</li>
              </ul>

              <h2>6. Payment and Assurance Methods</h2>
              <p>
                tykoonConnect offers three payment assurance methods:
              </p>
              <ul>
                <li><strong>Milestone Invoice:</strong> Payments made per milestone completion</li>
                <li><strong>External Escrow:</strong> Third-party escrow services (fees charged by escrow provider)</li>
                <li><strong>Card Hold:</strong> Temporary authorization with payment on completion</li>
              </ul>
              <p>
                Payment processing and disputes are handled according to the chosen assurance method. tykoonConnect does not hold funds or process payments directly.
              </p>

              <h2>7. User Responsibilities</h2>
              <p>
                <strong>Clients</strong> are responsible for:
              </p>
              <ul>
                <li>Providing clear project requirements</li>
                <li>Making payments as agreed</li>
                <li>Communicating professionally</li>
              </ul>
              <p>
                <strong>Freelancers</strong> are responsible for:
              </p>
              <ul>
                <li>Delivering work as specified</li>
                <li>Meeting agreed deadlines</li>
                <li>Maintaining professional standards</li>
              </ul>

              <h2>8. Intellectual Property</h2>
              <p>
                All intellectual property rights in delivered work belong to the party specified in the project agreement. Users retain ownership of their profiles, portfolios, and original content.
              </p>

              <h2>9. Privacy</h2>
              <p>
                Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
              </p>

              <h2>10. Disclaimers</h2>
              <p>
                tykoonConnect is provided &quot;as is&quot; without warranties of any kind. We do not guarantee:
              </p>
              <ul>
                <li>Uninterrupted service availability</li>
                <li>The quality of work or reliability of users</li>
                <li>Resolution of disputes between users</li>
                <li>Recovery of funds in case of fraud</li>
              </ul>

              <h2>11. Limitation of Liability</h2>
              <p>
                tykoonConnect shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the Platform.
              </p>

              <h2>12. Dispute Resolution</h2>
              <p>
                Users are encouraged to resolve disputes directly. For unresolved issues, our community moderation team can provide guidance. We reserve the right to suspend accounts that violate these terms.
              </p>

              <h2>13. Modifications</h2>
              <p>
                We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated revision date. Continued use of the service constitutes acceptance of modified terms.
              </p>

              <h2>14. Termination</h2>
              <p>
                Either party may terminate their account at any time. We reserve the right to suspend or terminate accounts that violate these terms or engage in harmful behavior.
              </p>

              <h2>15. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us through our Help Center or support channels.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> This is a demo version of our Terms of Service. 
                  In production, these would be reviewed by legal counsel and tailored to specific jurisdictions.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" asChild>
              <Link href="/privacy">View Privacy Policy</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/disclaimer">View Disclaimer</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}