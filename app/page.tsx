'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Navigation } from '@/components/navigation'
import { useAuth } from '@/lib/auth/context'
import { 
  Search, 
  Users, 
  Zap, 
  Heart, 
  Shield, 
  Globe, 
  Sparkles,
  TrendingUp,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Award,
  Infinity,
  DollarSign,
  Clock,
  MessageSquare
} from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function HomePage() {
  const { isAuthenticated } = useAuth()
  const [statsCount, setStatsCount] = useState({ users: 0, projects: 0, saved: 0 })
  
  // Animated counter effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setStatsCount({ users: 12847, projects: 3942, saved: 2450000 })
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-gray-900/[0.04] dark:bg-grid-slate-100/[0.02] bg-grid-pattern" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-400/20 to-blue-500/20 rounded-full blur-3xl" />
      
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center">
            {/* Premium badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm border border-blue-200/50 rounded-full px-4 sm:px-6 py-2 mb-6 sm:mb-8 group hover:scale-105 transition-all duration-300">
              <Sparkles className="h-4 w-4 text-blue-600 animate-pulse" />
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                World's First Zero-Fee Marketplace
              </span>
              <Infinity className="h-4 w-4 text-purple-600 group-hover:rotate-12 transition-transform" />
            </div>

            {/* Main headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-gray-900 dark:text-slate-100 mb-6 sm:mb-8 leading-tight px-4 sm:px-0">
              Work Without
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 dark:from-blue-400 dark:via-purple-400 dark:to-blue-300 bg-clip-text text-transparent"> Limits</span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 rounded-full opacity-60" />
              </span>
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-slate-300 mb-8 sm:mb-12 max-w-4xl mx-auto leading-relaxed px-4 sm:px-0">
              Connect with top talent and amazing clients on the only platform that 
              <span className="font-semibold text-blue-600 dark:text-blue-400"> keeps 100% of your earnings</span>. 
              No fees, no commissions, no compromise.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 px-4 sm:px-0">
              <Button 
                size="lg" 
                className="relative group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 min-h-[48px] touch-manipulation"
                asChild
              >
                <Link href={isAuthenticated ? "/jobs" : "/auth/signup"}>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  <Search className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                  <span className="relative">
                    {isAuthenticated ? "Find Work Now" : "Start Free Today"}
                  </span>
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              
              <Button 
                size="lg" 
                variant="outline"
                className="group border-2 border-gray-300 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 min-h-[48px] touch-manipulation"
                asChild
              >
                <Link href="/about">
                  <Play className="mr-3 h-6 w-6 text-blue-600 group-hover:scale-110 transition-transform" />
                  <span className="text-gray-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    See How It Works
                  </span>
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto px-4 sm:px-0">
              {[
                { label: "Active Users", value: statsCount.users.toLocaleString(), icon: Users },
                { label: "Projects Completed", value: statsCount.projects.toLocaleString(), icon: CheckCircle },
                { label: "Fees Saved", value: `$${(statsCount.saved / 1000).toFixed(0)}K`, icon: DollarSign }
              ].map((stat, index) => {
                const Icon = stat.icon
                return (
                  <div key={index} className="group">
                    <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/50 dark:border-slate-700/50 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
                      <Icon className="h-8 w-8 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                      <div className="text-3xl font-bold text-gray-900 dark:text-slate-100 mb-1">{stat.value}</div>
                      <div className="text-sm text-gray-600 dark:text-slate-400">{stat.label}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 text-white border-0 shadow-lg mb-6 px-4 py-2">
                <Award className="mr-2 h-4 w-4" />
                Why Choose Us
              </Badge>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                Built for <span className="bg-gradient-to-r from-emerald-600 to-blue-600 dark:from-emerald-400 dark:to-blue-400 bg-clip-text text-transparent">Success</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
                Every feature designed to maximize your earnings and minimize your hassle
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4 sm:px-0">
              {[
                {
                  icon: Infinity,
                  title: "Zero Platform Fees",
                  description: "Keep 100% of what you earn. No commissions, no transaction fees, no hidden costs.",
                  color: "from-green-500 to-emerald-500",
                  bgColor: "from-green-50 to-emerald-50"
                },
                {
                  icon: Shield,
                  title: "Flexible Assurance",
                  description: "Choose from milestone invoices, external escrow, or card holds. Your work, your terms.",
                  color: "from-blue-500 to-purple-500",
                  bgColor: "from-blue-50 to-purple-50"
                },
                {
                  icon: Heart,
                  title: "Community Driven",
                  description: "Sustained by voluntary donations from grateful users. No venture capital, no profit pressure.",
                  color: "from-pink-500 to-red-500",
                  bgColor: "from-pink-50 to-red-50"
                }
              ].map((feature, index) => (
                <Card key={index} className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 bg-white dark:bg-slate-800">
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                  <CardHeader className="relative z-10 text-center pb-4">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <feature.icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-xl font-bold mb-2 text-gray-900 dark:text-slate-100">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10 text-center">
                    <CardDescription className="text-gray-600 dark:text-slate-300 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-slate-100 mb-6">
                Simple, <span className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">Transparent</span>, Effective
              </h2>
              <p className="text-xl text-gray-600 dark:text-slate-300">Get started in minutes, not hours</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 px-4 sm:px-0 relative">
              {/* Connection lines */}
              <div className="hidden md:block absolute top-16 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300 dark:via-blue-500 to-transparent" />
              
              {[
                { step: "1", title: "Post", desc: "Clients post projects with clear requirements", icon: MessageSquare },
                { step: "2", title: "Propose", desc: "Freelancers submit detailed proposals", icon: Star },
                { step: "3", title: "Agree", desc: "Both parties agree on terms and assurance", icon: CheckCircle },
                { step: "4", title: "Deliver", desc: "Work gets done and delivered on time", icon: TrendingUp },
                { step: "5", title: "Review", desc: "Both parties leave honest feedback", icon: Award }
              ].map((item, index) => {
                const Icon = item.icon
                return (
                  <div key={index} className="text-center group">
                    <div className="relative mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity" />
                      <div className="relative bg-gradient-to-br from-blue-600 to-blue-700 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:scale-110 transition-transform duration-300">
                        <span className="text-xl font-bold">{item.step}</span>
                      </div>
                      <div className="absolute -top-2 -right-2 bg-white dark:bg-slate-700 rounded-full p-1.5 shadow-lg group-hover:scale-110 transition-transform duration-300">
                        <Icon className="h-4 w-4 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{item.title}</h3>
                    <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-grid-pattern" />
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <Sparkles className="h-16 w-16 text-yellow-400 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 px-4 sm:px-0">
              Ready to Experience True Freedom?
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-blue-100 mb-8 sm:mb-12 leading-relaxed px-4 sm:px-0">
              Join thousands of freelancers and clients who have discovered 
              what work looks like without platform fees.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center px-4 sm:px-0">
              <Button 
                size="lg" 
                className="bg-white text-blue-900 hover:bg-blue-50 px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-white/10 transition-all duration-300 transform hover:scale-105 group min-h-[48px] touch-manipulation"
                asChild
              >
                <Link href="/auth/signup">
                  <Zap className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
                  Get Started Free
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm px-6 sm:px-8 py-4 sm:py-6 text-base sm:text-lg font-semibold rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 min-h-[48px] touch-manipulation"
                asChild
              >
                <Link href="/jobs">
                  Browse Jobs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 text-white p-2 rounded-xl shadow-lg">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  tykoonConnect
                </h3>
              </div>
              <p className="text-gray-400 leading-relaxed">
                The world's first 100% free marketplace for freelancers and clients.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Platform</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/jobs" className="hover:text-white transition-colors">Find Work</Link></li>
                <li><Link href="/jobs/new" className="hover:text-white transition-colors">Post Jobs</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/help" className="hover:text-white transition-colors">Help</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/donations" className="hover:text-white transition-colors">Donate</Link></li>
                <li><Link href="/wall-of-support" className="hover:text-white transition-colors">Wall of Support</Link></li>
                <li><Link href="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link></li>
                <li><Link href="/disclaimer" className="hover:text-white transition-colors">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2024 tykoonConnect. Built with ❤️ for the freelancer community.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}