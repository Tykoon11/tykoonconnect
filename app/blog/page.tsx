import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, BookOpen, Calendar, User, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function BlogPage() {
  const blogPosts = [
    {
      id: '1',
      title: 'Why We Built the World\'s First 100% Free Marketplace',
      excerpt: 'The story behind tykoonConnect and our mission to eliminate platform fees forever.',
      author: 'Alex Chen',
      date: '2024-09-10',
      readTime: '5 min read',
      category: 'Company'
    },
    {
      id: '2', 
      title: 'Understanding the Three Payment Assurance Methods',
      excerpt: 'A detailed guide to Milestone Invoice, External Escrow, and Card Hold payment methods.',
      author: 'Sarah Johnson',
      date: '2024-09-08',
      readTime: '8 min read',
      category: 'Guide'
    },
    {
      id: '3',
      title: 'How to Write Winning Freelance Proposals',
      excerpt: 'Tips and strategies to make your proposals stand out and win more projects.',
      author: 'Mike Rodriguez',
      date: '2024-09-05',
      readTime: '6 min read',
      category: 'Tips'
    },
    {
      id: '4',
      title: 'The Hidden Cost of Platform Fees: A Deep Dive',
      excerpt: 'Analyzing how traditional marketplace fees impact freelancer earnings and client costs.',
      author: 'Alex Chen',
      date: '2024-09-03',
      readTime: '7 min read',
      category: 'Analysis'
    },
    {
      id: '5',
      title: 'Building Trust in a Fee-Free Environment',
      excerpt: 'How to establish credibility and protect yourself when there are no platform guarantees.',
      author: 'Sarah Johnson',
      date: '2024-09-01',
      readTime: '5 min read',
      category: 'Guide'
    },
    {
      id: '6',
      title: 'Community Spotlight: Success Stories',
      excerpt: 'Real stories from freelancers and clients who have found success on tykoonConnect.',
      author: 'Mike Rodriguez', 
      date: '2024-08-28',
      readTime: '4 min read',
      category: 'Community'
    }
  ]

  const categories = ['All', 'Company', 'Guide', 'Tips', 'Analysis', 'Community']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-full w-fit mx-auto mb-4">
              <BookOpen className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">tykoonConnect Blog</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Insights, tips, and stories from the world's first 100% free marketplace
            </p>
          </div>

          {/* Category Filter */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Browse by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge key={category} variant="secondary" className="cursor-pointer hover:bg-blue-100 hover:text-blue-600">
                    {category}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Featured Post */}
          <Card className="mb-8 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2 mb-3">
                <Badge className="bg-blue-600">Featured</Badge>
                <Badge variant="outline">Company</Badge>
              </div>
              <h2 className="text-2xl font-bold mb-3">
                <Link href="/blog/1" className="hover:text-blue-600">
                  Why We Built the World's First 100% Free Marketplace
                </Link>
              </h2>
              <p className="text-gray-600 mb-4">
                The story behind tykoonConnect and our mission to eliminate platform fees forever. 
                Learn about the problems we saw in traditional marketplaces and how we're building a better future for freelancers.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    Alex Chen
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    September 10, 2024
                  </div>
                  <span>5 min read</span>
                </div>
                <Button asChild>
                  <Link href="/blog/1">
                    Read More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Blog Posts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.slice(1).map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <span className="text-xs text-gray-500">{post.readTime}</span>
                  </div>
                  <CardTitle className="text-lg">
                    <Link href={`/blog/${post.id}`} className="hover:text-blue-600">
                      {post.title}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {post.excerpt}
                  </CardDescription>
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="h-3 w-3" />
                      <span>{post.author}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Newsletter Signup */}
          <Card className="mt-12">
            <CardHeader className="text-center">
              <CardTitle>Stay Updated</CardTitle>
              <CardDescription>
                Get the latest insights and updates from tykoonConnect delivered to your inbox
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Button>Subscribe</Button>
              </div>
              <p className="text-xs text-gray-500 text-center mt-2">
                Demo mode: Newsletter signup is not functional
              </p>
            </CardContent>
          </Card>

          {/* Coming Soon Notice */}
          <Card className="mt-8 bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-center text-sm">
                <p className="text-blue-800">
                  <strong>Demo Mode:</strong> This blog shows the planned content structure. 
                  In production, these would be full articles with rich content, comments, and social sharing.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}