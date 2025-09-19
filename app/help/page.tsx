import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Users, Search, HelpCircle, MessageSquare, Shield, CreditCard, FileText, Clock } from 'lucide-react'
import Link from 'next/link'

export default function HelpPage() {
  const faqCategories = [
    {
      title: "Getting Started",
      icon: HelpCircle,
      questions: [
        {
          q: "How do I create an account?",
          a: "Click 'Get Started' on the homepage, choose your role (Client/Freelancer), and follow the registration process. You can sign up with email and create your profile immediately."
        },
        {
          q: "Is tykoonConnect really 100% free?",
          a: "Yes! We charge zero platform fees, no commissions, and no subscription costs. Freelancers keep 100% of what they earn."
        },
        {
          q: "How do I post my first job?",
          a: "After signing up as a client, click 'Post Job' in the header. Fill out the job details, set your budget, choose your preferred assurance method, and publish."
        },
        {
          q: "How do I find work as a freelancer?",
          a: "Browse the 'Find Work' section, use filters to narrow down projects that match your skills, and submit proposals to clients whose projects interest you."
        }
      ]
    },
    {
      title: "Payment & Assurance",
      icon: Shield,
      questions: [
        {
          q: "What are the three assurance methods?",
          a: "1) Milestone Invoice - Pay per milestone completion, 2) External Escrow - Third-party escrow service, 3) Card Hold - Temporary authorization on your card. All provide payment security without platform fees."
        },
        {
          q: "How does Milestone Invoice work?",
          a: "Break your project into milestones. Client pays each milestone upon completion and approval. Money is released directly to the freelancer."
        },
        {
          q: "What is External Escrow?",
          a: "Use a third-party escrow service like Escrow.com. Funds are held by the escrow service and released when work is completed."
        },
        {
          q: "How does Card Hold work?",
          a: "A temporary hold is placed on the client's card for the full amount. When work is delivered and approved, the charge is processed and paid to the freelancer."
        },
        {
          q: "Who pays for escrow fees?",
          a: "External escrow services charge their own fees (typically 1-3%). This is split between client and freelancer or negotiated in your agreement."
        }
      ]
    },
    {
      title: "Projects & Proposals", 
      icon: FileText,
      questions: [
        {
          q: "How do I write a winning proposal?",
          a: "Be specific about your experience, provide relevant portfolio examples, address the client's needs directly, and suggest a clear project timeline with milestones."
        },
        {
          q: "Can I withdraw a proposal?",
          a: "Yes, you can withdraw proposals before they're accepted. Go to your dashboard, find the proposal, and select 'Withdraw'."
        },
        {
          q: "How do I track project progress?",
          a: "Use your dashboard to monitor active projects, communicate with clients, submit deliverables, and track payment milestones."
        },
        {
          q: "What happens if there's a dispute?",
          a: "First, communicate directly with the other party. If unresolved, you can file a report through our dispute resolution system. We provide mediation and guidance."
        }
      ]
    },
    {
      title: "Communication",
      icon: MessageSquare,
      questions: [
        {
          q: "How do I message clients/freelancers?",
          a: "Use the built-in messaging system accessible from your dashboard. All project-related communication is threaded and organized by project."
        },
        {
          q: "Can clients and freelancers exchange contact info?",
          a: "Yes! Since we don't charge fees, you're free to communicate however works best for your project. Many users still prefer our platform messaging for organization."
        },
        {
          q: "How do I share files and documents?",
          a: "Upload files directly through the messaging system or project deliverables section. Large files can be shared via cloud storage links."
        }
      ]
    }
  ]

  const quickLinks = [
    { title: "Post a Job", href: "/jobs/new", desc: "Hire talented freelancers" },
    { title: "Find Work", href: "/jobs", desc: "Browse available projects" },  
    { title: "Dashboard", href: "/dashboard", desc: "Manage your projects" },
    { title: "Donate", href: "/donations", desc: "Support the platform" }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
            <p className="text-xl text-gray-600 mb-8">
              Everything you need to know about using tykoonConnect
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input 
                type="text" 
                placeholder="Search help articles..."
                className="pl-12 pr-4 py-3 text-lg"
              />
            </div>
          </div>

          {/* Quick Links */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Quick Links</CardTitle>
              <CardDescription>Common actions and important pages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {quickLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <h3 className="font-medium text-blue-600 mb-1">{link.title}</h3>
                    <p className="text-sm text-gray-600">{link.desc}</p>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ Sections */}
          <div className="space-y-8">
            {faqCategories.map((category) => (
              <Card key={category.title}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                      <category.icon className="h-5 w-5" />
                    </div>
                    <CardTitle>{category.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {category.questions.map((faq, index) => (
                      <div key={index}>
                        <h3 className="font-medium text-gray-900 mb-2">{faq.q}</h3>
                        <p className="text-gray-600 leading-relaxed">{faq.a}</p>
                        {index < category.questions.length - 1 && (
                          <div className="border-b border-gray-200 mt-4" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact Support */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Still Need Help?</CardTitle>
              <CardDescription>
                Can&apos;t find what you&apos;re looking for? We&apos;re here to help!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-medium mb-2">Send us a message</h3>
                  <p className="text-gray-600 mb-4">Get help from our support team</p>
                  <Button>Contact Support</Button>
                </div>
                <div className="text-center p-6 border rounded-lg">
                  <Clock className="h-8 w-8 text-green-600 mx-auto mb-3" />
                  <h3 className="font-medium mb-2">Response Times</h3>
                  <p className="text-gray-600 mb-4">We typically respond within 24 hours</p>
                  <Badge variant="secondary">Fast Support</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Platform Info */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Why tykoonConnect is Different</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-green-100 text-green-600 p-3 rounded-full w-fit mx-auto mb-3">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium mb-2">100% Free</h3>
                  <p className="text-gray-600 text-sm">No platform fees, no commissions, no hidden costs</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-fit mx-auto mb-3">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium mb-2">Flexible Assurance</h3>
                  <p className="text-gray-600 text-sm">Choose the payment method that works for you</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-full w-fit mx-auto mb-3">
                    <Users className="h-6 w-6" />
                  </div>
                  <h3 className="font-medium mb-2">Community Driven</h3>
                  <p className="text-gray-600 text-sm">Built by and for the freelancer community</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Demo Notice */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center text-sm">
                <p className="text-blue-800">
                  <strong>Demo Mode:</strong> This help center shows the complete support experience. 
                  In production, contact forms would be fully functional and connected to our support system.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}