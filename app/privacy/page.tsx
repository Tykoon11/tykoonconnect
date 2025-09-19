import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPage() {
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
              <div className="bg-green-100 text-green-600 p-3 rounded-full w-fit mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <CardTitle className="text-3xl">Privacy Policy</CardTitle>
              <CardDescription>
                Last updated: September 11, 2024
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Content */}
          <Card>
            <CardContent className="prose max-w-none pt-6">
              <h2>1. Introduction</h2>
              <p>
                tykoonConnect (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you use our platform.
              </p>

              <h2>2. Information We Collect</h2>
              
              <h3>2.1 Information You Provide</h3>
              <ul>
                <li><strong>Account Information:</strong> Name, email address, username, password</li>
                <li><strong>Profile Information:</strong> Bio, skills, location, portfolio items, profile photo</li>
                <li><strong>Job and Proposal Data:</strong> Job postings, proposals, project communications</li>
                <li><strong>Payment Information:</strong> Billing details for chosen assurance methods</li>
                <li><strong>Communications:</strong> Messages sent through our platform</li>
              </ul>

              <h3>2.2 Information Automatically Collected</h3>
              <ul>
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent on platform</li>
                <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
                <li><strong>Cookies:</strong> Session data, preferences, authentication tokens</li>
              </ul>

              <h2>3. How We Use Your Information</h2>
              <p>We use collected information to:</p>
              <ul>
                <li>Provide and maintain our marketplace services</li>
                <li>Facilitate connections between clients and freelancers</li>
                <li>Process and secure payments through chosen assurance methods</li>
                <li>Send important platform updates and notifications</li>
                <li>Improve our platform based on usage patterns</li>
                <li>Prevent fraud and ensure platform security</li>
                <li>Comply with legal obligations</li>
              </ul>

              <h2>4. Information Sharing</h2>
              
              <h3>4.1 With Other Users</h3>
              <p>Your profile information, job postings, and proposals are visible to relevant platform users to facilitate business connections.</p>

              <h3>4.2 With Service Providers</h3>
              <p>We may share data with trusted third-party services for:</p>
              <ul>
                <li>Authentication and security services</li>
                <li>Payment processing (for chosen assurance methods)</li>
                <li>Email communications</li>
                <li>Analytics and platform improvement</li>
              </ul>

              <h3>4.3 Legal Requirements</h3>
              <p>We may disclose information when required by law or to protect our rights, users, or the public.</p>

              <h2>5. Data Security</h2>
              <p>We implement appropriate security measures to protect your personal information:</p>
              <ul>
                <li>Encryption of sensitive data in transit and at rest</li>
                <li>Secure authentication systems</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls limiting who can view your data</li>
                <li>Monitoring for suspicious activities</li>
              </ul>

              <h2>6. Data Retention</h2>
              <p>
                We retain your personal information only as long as necessary for the purposes outlined in this policy or as required by law. You may request deletion of your account and associated data at any time.
              </p>

              <h2>7. Your Rights</h2>
              <p>You have the right to:</p>
              <ul>
                <li><strong>Access:</strong> Request copies of your personal data</li>
                <li><strong>Rectification:</strong> Correct inaccurate or incomplete information</li>
                <li><strong>Erasure:</strong> Request deletion of your personal data</li>
                <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format</li>
                <li><strong>Objection:</strong> Object to processing of your personal data</li>
                <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing</li>
              </ul>

              <h2>8. Cookies and Tracking</h2>
              <p>We use cookies and similar technologies to:</p>
              <ul>
                <li>Keep you signed in to your account</li>
                <li>Remember your preferences and settings</li>
                <li>Analyze platform usage and performance</li>
                <li>Provide personalized experiences</li>
              </ul>
              <p>You can control cookie settings through your browser preferences.</p>

              <h2>9. Third-Party Links</h2>
              <p>
                Our platform may contain links to external websites. We are not responsible for the privacy practices of these third-party sites. We encourage you to review their privacy policies.
              </p>

              <h2>10. Children's Privacy</h2>
              <p>
                tykoonConnect is not intended for users under 18 years of age. We do not knowingly collect personal information from children under 18.
              </p>

              <h2>11. International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for international transfers.
              </p>

              <h2>12. Changes to This Policy</h2>
              <p>
                We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date. Significant changes will be communicated via email or platform notifications.
              </p>

              <h2>13. Contact Us</h2>
              <p>
                If you have questions about this privacy policy or how we handle your personal data, please contact us through our Help Center or support channels.
              </p>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-8">
                <p className="text-green-800 text-sm">
                  <strong>Our Commitment:</strong> As a zero-fee platform, we have no financial incentive to sell your data. 
                  Your privacy is protected because our business model doesn&apos;t depend on data monetization.
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
              <Link href="/disclaimer">View Disclaimer</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}