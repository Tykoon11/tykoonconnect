import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Heart, Zap, Shield, Globe, Target, Code, Coffee } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  const teamMembers = [
    {
      name: "Alex Chen",
      role: "Founder & Lead Developer",
      bio: "Full-stack developer with 8 years of experience building marketplace platforms.",
      avatar: "AC"
    },
    {
      name: "Sarah Johnson", 
      role: "Product Designer",
      bio: "UX designer passionate about creating intuitive user experiences.",
      avatar: "SJ"
    },
    {
      name: "Mike Rodriguez",
      role: "Community Manager",
      bio: "Former freelancer turned advocate for fair marketplace practices.",
      avatar: "MR"
    }
  ]

  const milestones = [
    { year: "2024", event: "tykoonConnect launches with zero-fee model" },
    { year: "2024", event: "First 1,000 successful project completions" },
    { year: "2024", event: "Three assurance methods implemented" },
    { year: "2024", event: "Community-driven feature development begins" }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">

      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            About tykoonConnect
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We believe freelancing should be about connecting talented people with great opportunities, 
            not about paying platform fees. That&apos;s why we built the world&apos;s first truly free marketplace.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-lg text-gray-600">
                To create a truly fair and sustainable marketplace where talent meets opportunity without barriers.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-fit mb-4">
                    <Target className="h-6 w-6" />
                  </div>
                  <CardTitle>Our Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    A world where skilled professionals can work with clients directly, 
                    keeping 100% of their earnings and building genuine relationships 
                    without platform interference.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="bg-green-100 text-green-600 p-3 rounded-full w-fit mb-4">
                    <Heart className="h-6 w-6" />
                  </div>
                  <CardTitle>Our Values</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Transparency, fairness, and community-first thinking. We&apos;re not here 
                    to extract value from your work—we&apos;re here to facilitate meaningful 
                    professional connections.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Why Zero Fees */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Zero Fees?</h2>
              <p className="text-lg text-gray-600">
                Traditional platforms charge 5-20% fees. We think that&apos;s wrong.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-red-100 text-red-600 p-4 rounded-full w-fit mx-auto mb-4">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Platform Fees Are Unfair</h3>
                <p className="text-gray-600">
                  Why should platforms take 20% when you do 100% of the work? 
                  Your skills deserve full compensation.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-blue-100 text-blue-600 p-4 rounded-full w-fit mx-auto mb-4">
                  <Shield className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Assurance Without Fees</h3>
                <p className="text-gray-600">
                  We provide payment security through multiple assurance methods 
                  without charging commissions.
                </p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 text-purple-600 p-4 rounded-full w-fit mx-auto mb-4">
                  <Globe className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Sustainability</h3>
                <p className="text-gray-600">
                  Supported by voluntary donations from users who love the platform, 
                  not forced fees.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h2>
              <p className="text-lg text-gray-600">
                Built by freelancers who understand the challenges you face.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {teamMembers.map((member) => (
                <Card key={member.name} className="text-center">
                  <CardHeader>
                    <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                      {member.avatar}
                    </div>
                    <CardTitle>{member.name}</CardTitle>
                    <CardDescription className="font-medium text-blue-600">{member.role}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{member.bio}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How We Stay Free */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">How We Stay Free</h2>
              <p className="text-lg text-gray-600">
                Transparency about our sustainable, community-driven model.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <div className="bg-green-100 text-green-600 p-3 rounded-full w-fit mb-4">
                    <Coffee className="h-6 w-6" />
                  </div>
                  <CardTitle>Voluntary Donations</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    Users who find value in the platform can donate any amount they choose. 
                    No pressure, no requirements. Just community support.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-full w-fit mb-4">
                    <Code className="h-6 w-6" />
                  </div>
                  <CardTitle>Lean Operations</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    We keep costs low by using efficient, modern technology and 
                    focusing on what matters most: connecting great people.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-8">
              <Button asChild>
                <Link href="/donations">Support tykoonConnect</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Journey</h2>
              <p className="text-lg text-gray-600">
                Key milestones in building the world&apos;s first free marketplace.
              </p>
            </div>

            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center font-bold">
                    {milestone.year}
                  </div>
                  <div className="flex-1">
                    <p className="text-lg text-gray-900">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Experience True Freedom?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of freelancers and clients who have discovered 
            what work looks like without platform fees.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/auth/signup">Get Started Free</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/jobs">Browse Jobs</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-blue-600 text-white p-2 rounded-lg">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-bold">tykoonConnect</h3>
              </div>
              <p className="text-gray-400">
                The world&apos;s first 100% free marketplace for freelancers and clients.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/jobs" className="hover:text-white">Find Work</Link></li>
                <li><Link href="/jobs/new" className="hover:text-white">Post Jobs</Link></li>
                <li><Link href="/help" className="hover:text-white">Help</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/donations" className="hover:text-white">Donate</Link></li>
                <li><Link href="/wall-of-support" className="hover:text-white">Wall of Support</Link></li>
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/terms" className="hover:text-white">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy</Link></li>
                <li><Link href="/disclaimer" className="hover:text-white">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 tykoonConnect. Built with ❤️ for the freelancer community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}