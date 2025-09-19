import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Heart, Star, Coffee, Trophy, Gift } from 'lucide-react'
import Link from 'next/link'

export default function WallOfSupportPage() {
  const supporters = [
    {
      name: "Sarah M.",
      location: "San Francisco, CA",
      amount: 100,
      message: "Amazing platform! Finally a place where freelancers are treated fairly. Keep up the incredible work!",
      date: "2024-09-10",
      tier: "champion"
    },
    {
      name: "Mike R.",
      location: "Austin, TX", 
      amount: 50,
      message: "Love that there are no platform fees. This is how freelancing should work everywhere.",
      date: "2024-09-09",
      tier: "supporter"
    },
    {
      name: "Jessica L.",
      location: "New York, NY",
      amount: 25,
      message: "Great concept and execution. Happy to support a platform that puts freelancers first!",
      date: "2024-09-08",
      tier: "friend"
    },
    {
      name: "David K.",
      location: "London, UK",
      amount: 75,
      message: "As a freelancer, this platform has been a game changer. No more losing 20% to fees!",
      date: "2024-09-07",
      tier: "supporter"
    },
    {
      name: "Anonymous",
      location: "Toronto, CA",
      amount: 200,
      message: "Supporting innovation in the freelance space. You're building something special here.",
      date: "2024-09-06",
      tier: "champion"
    },
    {
      name: "Maria S.",
      location: "Berlin, DE",
      amount: 30,
      message: "Finally found my go-to platform for freelance work. Zero fees makes all the difference!",
      date: "2024-09-05",
      tier: "friend"
    },
    {
      name: "Alex T.",
      location: "Sydney, AU",
      amount: 150,
      message: "Brilliant idea executed perfectly. The three assurance methods give so much flexibility.",
      date: "2024-09-04",
      tier: "champion"
    },
    {
      name: "Rachel W.",
      location: "Chicago, IL",
      amount: 40,
      message: "Love supporting a platform that's truly built for the community, not for profit extraction.",
      date: "2024-09-03",
      tier: "friend"
    }
  ]

  const getTierDetails = (tier: string) => {
    switch (tier) {
      case 'champion':
        return { icon: Trophy, color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Champion' }
      case 'supporter': 
        return { icon: Heart, color: 'text-red-600', bgColor: 'bg-red-100', label: 'Supporter' }
      case 'friend':
        return { icon: Coffee, color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Friend' }
      default:
        return { icon: Gift, color: 'text-gray-600', bgColor: 'bg-gray-100', label: 'Contributor' }
    }
  }

  const stats = {
    totalDonations: 670,
    supporters: supporters.length,
    averageDonation: Math.round(supporters.reduce((sum, s) => sum + s.amount, 0) / supporters.length),
    thisMonth: 450
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Wall of Support
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Celebrating our amazing community members who help keep tykoonConnect 100% free for everyone.
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">${stats.totalDonations}</div>
              <div className="text-sm text-gray-600">Total Raised</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.supporters}</div>
              <div className="text-sm text-gray-600">Supporters</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">${stats.averageDonation}</div>
              <div className="text-sm text-gray-600">Avg Donation</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">${stats.thisMonth}</div>
              <div className="text-sm text-gray-600">This Month</div>
            </div>
          </div>

          <Button size="lg" asChild>
            <Link href="/donations">
              <Heart className="mr-2 h-5 w-5" />
              Join Our Supporters
            </Link>
          </Button>
        </div>
      </section>

      {/* Support Tiers */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Support Tiers</h2>
              <p className="text-lg text-gray-600">
                Every contribution helps us maintain a truly free platform
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-fit mx-auto mb-4">
                    <Coffee className="h-6 w-6" />
                  </div>
                  <CardTitle>Friend</CardTitle>
                  <CardDescription>$5 - $49</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Buy us a coffee and show your support for fee-free freelancing.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-red-200">
                <CardHeader>
                  <div className="bg-red-100 text-red-600 p-3 rounded-full w-fit mx-auto mb-4">
                    <Heart className="h-6 w-6" />
                  </div>
                  <CardTitle>Supporter</CardTitle>
                  <CardDescription>$50 - $99</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Help us cover hosting costs and platform maintenance.
                  </p>
                </CardContent>
              </Card>

              <Card className="text-center border-yellow-200">
                <CardHeader>
                  <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full w-fit mx-auto mb-4">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <CardTitle>Champion</CardTitle>
                  <CardDescription>$100+</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Enable us to build new features and expand our impact.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Supporters Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Amazing Supporters</h2>
              <p className="text-lg text-gray-600">
                Thank you to everyone who believes in our mission
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {supporters.map((supporter, index) => {
                const tierDetails = getTierDetails(supporter.tier)
                const TierIcon = tierDetails.icon

                return (
                  <Card key={index} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-gray-100 text-gray-600 w-12 h-12 rounded-full flex items-center justify-center font-bold">
                            {supporter.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{supporter.name}</h3>
                            <p className="text-sm text-gray-600">{supporter.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`${tierDetails.bgColor} ${tierDetails.color} p-2 rounded-full w-fit ml-auto mb-1`}>
                            <TierIcon className="h-4 w-4" />
                          </div>
                          <Badge variant="outline" className="text-xs">
                            ${supporter.amount}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <blockquote className="text-gray-700 italic mb-2">
                        &ldquo;{supporter.message}&rdquo;
                      </blockquote>
                      <p className="text-xs text-gray-500">
                        {new Date(supporter.date).toLocaleDateString()}
                      </p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Thank You Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Why Your Support Matters
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Every donation, no matter the size, helps us maintain a platform where freelancers can thrive 
              without platform fees. Your support enables us to:
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="text-center">
                <div className="bg-green-100 text-green-600 p-3 rounded-full w-fit mx-auto mb-3">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Keep It Free</h3>
                <p className="text-gray-600 text-sm">Cover hosting and operational costs so we never need to charge fees</p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-fit mx-auto mb-3">
                  <Star className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Build Features</h3>
                <p className="text-gray-600 text-sm">Develop new tools and improvements requested by the community</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 text-purple-600 p-3 rounded-full w-fit mx-auto mb-3">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="font-semibold mb-2">Grow Together</h3>
                <p className="text-gray-600 text-sm">Expand our reach and help more freelancers discover fee-free work</p>
              </div>
            </div>

            <Button size="lg" asChild>
              <Link href="/donations">
                <Gift className="mr-2 h-5 w-5" />
                Support tykoonConnect
              </Link>
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
                <li><Link href="/about" className="hover:text-white">About</Link></li>
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