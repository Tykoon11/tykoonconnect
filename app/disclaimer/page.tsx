import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, AlertTriangle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function DisclaimerPage() {
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
              <div className="bg-orange-100 text-orange-600 p-3 rounded-full w-fit mx-auto mb-4">
                <AlertTriangle className="h-8 w-8" />
              </div>
              <CardTitle className="text-3xl">Disclaimer</CardTitle>
              <CardDescription>
                Last updated: September 11, 2024
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Content */}
          <Card>
            <CardContent className="prose max-w-none pt-6">
              <h2>1. Platform Nature</h2>
              <p>
                tykoonConnect is a marketplace platform that facilitates connections between clients and freelancers. We are not a party to any agreements made between users and do not employ freelancers or guarantee work outcomes.
              </p>

              <h2>2. No Warranties</h2>
              <p>
                The platform is provided &quot;as is&quot; and &quot;as available&quot; without any warranties of any kind, whether express or implied. We specifically disclaim:
              </p>
              <ul>
                <li>Warranties of merchantability or fitness for a particular purpose</li>
                <li>Guarantees about the availability, reliability, or functionality of the platform</li>
                <li>Assurances about the quality, accuracy, or completeness of content</li>
                <li>Promises about uninterrupted or error-free service</li>
              </ul>

              <h2>3. User Responsibility</h2>
              <p>Users are solely responsible for:</p>
              <ul>
                <li>Evaluating the suitability of other users for their projects</li>
                <li>Conducting due diligence before entering agreements</li>
                <li>Negotiating fair terms and payment arrangements</li>
                <li>Resolving disputes that may arise during projects</li>
                <li>Complying with applicable laws and regulations</li>
                <li>Protecting their own interests in all transactions</li>
              </ul>

              <h2>4. Payment and Financial Matters</h2>
              <p>
                tykoonConnect does not process payments directly. We provide three assurance method options, but:
              </p>
              <ul>
                <li>We do not guarantee successful payment completion</li>
                <li>External escrow services have their own terms and fees</li>
                <li>Card hold mechanisms depend on third-party payment processors</li>
                <li>Users are responsible for understanding chosen payment methods</li>
                <li>We are not liable for payment failures or financial losses</li>
              </ul>

              <h2>5. Work Quality and Outcomes</h2>
              <p>tykoonConnect makes no representations about:</p>
              <ul>
                <li>The quality of work delivered by freelancers</li>
                <li>The reliability or professionalism of any user</li>
                <li>The accuracy of user profiles or portfolios</li>
                <li>The likelihood of project success</li>
                <li>Meeting deadlines or deliverable specifications</li>
              </ul>

              <h2>6. Third-Party Services</h2>
              <p>
                Our platform may integrate with or link to third-party services. We are not responsible for:
              </p>
              <ul>
                <li>The availability or functionality of external services</li>
                <li>Privacy practices of third-party providers</li>
                <li>Terms and conditions of external platforms</li>
                <li>Fees charged by third-party services</li>
                <li>Data security of external integrations</li>
              </ul>

              <h2>7. Legal Compliance</h2>
              <p>
                Users must ensure their activities comply with applicable laws, including:
              </p>
              <ul>
                <li>Employment and labor regulations in their jurisdiction</li>
                <li>Tax obligations and reporting requirements</li>
                <li>Intellectual property and copyright laws</li>
                <li>International trade and export regulations</li>
                <li>Professional licensing requirements</li>
              </ul>

              <h2>8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, tykoonConnect shall not be liable for any:
              </p>
              <ul>
                <li>Direct, indirect, incidental, or consequential damages</li>
                <li>Loss of profits, revenue, or business opportunities</li>
                <li>Data loss or corruption</li>
                <li>Service interruptions or technical failures</li>
                <li>Actions or omissions of platform users</li>
                <li>Disputes between users or payment failures</li>
              </ul>

              <h2>9. Indemnification</h2>
              <p>
                Users agree to indemnify and hold harmless tykoonConnect from any claims, damages, or expenses arising from:
              </p>
              <ul>
                <li>Their use of the platform</li>
                <li>Violation of these terms or applicable laws</li>
                <li>Disputes with other users</li>
                <li>Content they post or share</li>
                <li>Professional services they provide or receive</li>
              </ul>

              <h2>10. Force Majeure</h2>
              <p>
                We shall not be liable for any failure to perform due to circumstances beyond our reasonable control, including but not limited to natural disasters, government actions, or technical failures of third-party services.
              </p>

              <h2>11. Beta Features and Changes</h2>
              <p>
                Some platform features may be in beta or experimental stages. We reserve the right to:
              </p>
              <ul>
                <li>Modify or discontinue features at any time</li>
                <li>Change platform functionality without notice</li>
                <li>Update terms and policies as needed</li>
              </ul>

              <h2>12. Professional Advice</h2>
              <p>
                Nothing on this platform constitutes professional advice. Users should consult qualified professionals for:
              </p>
              <ul>
                <li>Legal matters and contract review</li>
                <li>Tax planning and compliance</li>
                <li>Financial and business decisions</li>
                <li>Technical or specialized expertise</li>
              </ul>

              <h2>13. International Users</h2>
              <p>
                tykoonConnect is accessible globally, but users are responsible for compliance with local laws and regulations in their jurisdiction.
              </p>

              <h2>14. Contact Information</h2>
              <p>
                Questions about this disclaimer should be directed to our support team through the Help Center.
              </p>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-8">
                <p className="text-orange-800 text-sm">
                  <strong>Important:</strong> This disclaimer is part of our Terms of Service. 
                  By using tykoonConnect, you acknowledge that you have read, understood, and agree to these limitations and disclaimers.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <Button variant="outline" asChild>
              <Link href="/terms">View Terms of Service</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/privacy">View Privacy Policy</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}