'use client'

import { useState, useEffect } from 'react'
import { Navigation } from '@/components/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Calendar, 
  User, 
  Clock, 
  Eye, 
  Heart, 
  Share2, 
  ArrowLeft,
  BookOpen,
  MessageSquare,
  Bookmark,
  ThumbsUp
} from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: {
    name: string
    handle: string
    bio: string
  }
  publishedAt: string
  readTime: string
  category: string
  tags: string[]
  views: number
  likes: number
  featured: boolean
}

// Demo blog posts data
const demoPosts: Record<string, BlogPost> = {
  '1': {
    id: '1',
    title: 'The Future of Freelancing: Zero-Fee Platforms and What They Mean for Workers',
    content: `
      <p>The freelancing landscape is undergoing a revolutionary transformation. For years, freelancers have accepted that platform fees are simply "the cost of doing business." But what if that didn't have to be the case?</p>

      <h2>The Problem with Traditional Platforms</h2>
      <p>Traditional freelancing platforms typically charge anywhere from 5-20% in fees, often taking a significant portion of a freelancer's hard-earned income. These fees can add up to thousands of dollars per year for active freelancers.</p>

      <p>Consider this: if you earn $50,000 annually through a platform that charges 10% fees, you're paying $5,000 just for the privilege of finding work. That's equivalent to working an entire month for free!</p>

      <h2>The Zero-Fee Revolution</h2>
      <p>Zero-fee platforms represent a fundamental shift in how we think about freelancing marketplaces. Instead of extracting value from transactions, these platforms focus on creating value for their communities.</p>

      <p>At tykoonConnect, we've proven that a sustainable, zero-fee model is possible through voluntary donations from grateful users. This approach aligns our interests with yours – we succeed when you succeed, not when we take a cut of your earnings.</p>

      <h2>What This Means for Freelancers</h2>
      <ul>
        <li><strong>Keep 100% of your earnings:</strong> Every dollar you earn stays in your pocket</li>
        <li><strong>Competitive pricing:</strong> Without platform fees, you can offer more competitive rates</li>
        <li><strong>Transparent relationships:</strong> Direct communication with clients without intermediary interference</li>
        <li><strong>Community-driven development:</strong> Platform features are driven by user needs, not profit margins</li>
      </ul>

      <h2>The Challenges Ahead</h2>
      <p>While zero-fee platforms offer tremendous benefits, they also face unique challenges:</p>

      <p><strong>Sustainability:</strong> Without transaction fees, platforms must find alternative revenue models. Donation-based models require strong community support and transparent operations.</p>

      <p><strong>Trust and Safety:</strong> Traditional platforms use fees to fund extensive verification and dispute resolution systems. Zero-fee platforms must be creative in maintaining safety without compromising on cost.</p>

      <p><strong>Growth and Marketing:</strong> With limited marketing budgets, zero-fee platforms rely heavily on word-of-mouth and community advocacy.</p>

      <h2>Looking Forward</h2>
      <p>The future of freelancing is bright, and zero-fee platforms are just the beginning. As more freelancers discover these alternatives, we expect to see:</p>

      <ul>
        <li>Increased adoption of community-driven platforms</li>
        <li>More transparent business models</li>
        <li>Greater freelancer empowerment and earnings</li>
        <li>Innovation in trust and verification systems</li>
      </ul>

      <p>The question isn't whether zero-fee platforms will succeed – it's how quickly the freelancing community will embrace this new model. The future is here, and it's fee-free.</p>

      <h2>Join the Movement</h2>
      <p>Ready to keep 100% of your earnings? <a href="/auth/signup" class="text-blue-600 hover:underline">Join tykoonConnect</a> today and experience freelancing without limits.</p>
    `,
    excerpt: 'Exploring how zero-fee platforms are revolutionizing the freelancing industry and what it means for independent workers worldwide.',
    author: {
      name: 'Alex Chen',
      handle: 'alexc_writer',
      bio: 'Freelance writer and industry analyst with 8 years of experience covering the future of work.'
    },
    publishedAt: '2024-01-10T10:00:00Z',
    readTime: '8 min read',
    category: 'Industry Insights',
    tags: ['Freelancing', 'Platform Economy', 'Future of Work', 'Zero Fees'],
    views: 2341,
    likes: 156,
    featured: true
  },
  '2': {
    id: '2',
    title: 'Building Trust in Remote Work: Best Practices for Freelancers and Clients',
    content: `
      <p>Trust is the foundation of successful remote work relationships. In a world where face-to-face meetings are rare, building and maintaining trust becomes both more challenging and more crucial.</p>

      <h2>For Freelancers: Establishing Credibility</h2>
      <p>As a freelancer, your reputation is your most valuable asset. Here are proven strategies to build trust with potential clients:</p>

      <h3>1. Complete Your Profile Thoroughly</h3>
      <p>A comprehensive profile is your digital storefront. Include:</p>
      <ul>
        <li>Professional headshot</li>
        <li>Detailed work history</li>
        <li>Portfolio showcasing your best work</li>
        <li>Client testimonials and reviews</li>
        <li>Clear rate information</li>
      </ul>

      <h3>2. Communicate Proactively</h3>
      <p>Regular, clear communication builds confidence. Set expectations early and provide frequent updates on project progress.</p>

      <h3>3. Deliver on Promises</h3>
      <p>Nothing builds trust faster than consistently meeting deadlines and exceeding expectations. Under-promise and over-deliver whenever possible.</p>

      <h2>For Clients: Creating Safe Partnerships</h2>
      <p>Clients also play a crucial role in fostering trusted relationships:</p>

      <h3>1. Write Clear Project Briefs</h3>
      <p>Detailed project descriptions prevent misunderstandings and set freelancers up for success.</p>

      <h3>2. Provide Timely Feedback</h3>
      <p>Quick, constructive feedback keeps projects on track and shows respect for the freelancer's time.</p>

      <h3>3. Honor Payment Terms</h3>
      <p>Paying promptly and as agreed builds your reputation as a trustworthy client.</p>

      <h2>Tools for Building Trust</h2>
      <p>Several tools and practices can help both parties build confidence:</p>

      <ul>
        <li><strong>Video calls:</strong> Face-to-face interaction, even virtual, builds stronger connections</li>
        <li><strong>Project management tools:</strong> Transparent progress tracking</li>
        <li><strong>Time tracking:</strong> Demonstrates work ethic and helps with billing transparency</li>
        <li><strong>Regular check-ins:</strong> Scheduled meetings to discuss progress and address concerns</li>
      </ul>

      <h2>Handling Disputes</h2>
      <p>Even with the best intentions, disagreements can arise. Here's how to handle them professionally:</p>

      <ol>
        <li><strong>Communicate openly:</strong> Address issues directly and respectfully</li>
        <li><strong>Document everything:</strong> Keep records of all agreements and communications</li>
        <li><strong>Seek mediation:</strong> Use platform dispute resolution services when available</li>
        <li><strong>Learn from experience:</strong> Use conflicts as opportunities to improve processes</li>
      </ol>

      <h2>The Long Game</h2>
      <p>Building trust takes time, but the payoff is enormous. Trusted freelancers enjoy:</p>
      <ul>
        <li>Higher rates</li>
        <li>More repeat clients</li>
        <li>Better referrals</li>
        <li>Less time spent on proposals</li>
      </ul>

      <p>Similarly, clients who build reputations for fairness and clear communication attract the best freelancers and receive higher quality work.</p>

      <p>Trust isn't just good business – it's the foundation of a thriving remote work economy.</p>
    `,
    excerpt: 'Essential strategies for building trust and maintaining strong professional relationships in remote work environments.',
    author: {
      name: 'Sarah Rodriguez',
      handle: 'sarah_remote',
      bio: 'Remote work consultant and author of "The Trust Factor in Digital Collaboration"'
    },
    publishedAt: '2024-01-08T14:30:00Z',
    readTime: '6 min read',
    category: 'Best Practices',
    tags: ['Remote Work', 'Trust', 'Communication', 'Professional Development'],
    views: 1892,
    likes: 134,
    featured: false
  }
}

// Related posts
const relatedPosts = [
  {
    id: '3',
    title: 'Pricing Your Services: A Complete Guide for Freelancers',
    excerpt: 'Learn how to price your freelance services competitively while ensuring profitability.',
    readTime: '5 min read',
    category: 'Business'
  },
  {
    id: '4',
    title: 'The Rise of Specialized Freelance Niches',
    excerpt: 'Discover emerging freelance specializations and how to position yourself in growing markets.',
    readTime: '7 min read',
    category: 'Industry Insights'
  },
  {
    id: '5',
    title: 'Managing Multiple Client Projects Effectively',
    excerpt: 'Proven strategies for juggling multiple projects without compromising quality.',
    readTime: '6 min read',
    category: 'Productivity'
  }
]

export default function BlogPostPage() {
  const params = useParams()
  const postId = params.id as string
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [post, setPost] = useState<BlogPost | null>(null)

  useEffect(() => {
    // In a real app, this would fetch from an API
    const foundPost = demoPosts[postId]
    if (foundPost) {
      setPost(foundPost)
    } else {
      // Generate a placeholder post for any ID that doesn't exist
      setPost({
        id: postId,
        title: 'Blog Post Not Found',
        content: '<p>This is a demo blog post page. In a real application, this would fetch content from a database or CMS based on the post ID.</p><p>The post ID you requested was: <strong>' + postId + '</strong></p><p>Currently available demo posts are ID 1 and 2.</p>',
        excerpt: 'This blog post does not exist in our demo data.',
        author: {
          name: 'Demo Author',
          handle: 'demo_user',
          bio: 'This is a placeholder author for demonstration purposes.'
        },
        publishedAt: new Date().toISOString(),
        readTime: '2 min read',
        category: 'Demo',
        tags: ['Demo', 'Placeholder'],
        views: 0,
        likes: 0,
        featured: false
      })
    }
  }, [postId])

  const handleLike = () => {
    setLiked(!liked)
    // In a real app, this would update the server
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
    // In a real app, this would update the server
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert('Link copied to clipboard!')
    }
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100 mb-4">Loading...</h1>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Button variant="outline" className="mb-6" asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
          </Button>

          {/* Article Header */}
          <article>
            <header className="mb-8">
              <div className="flex items-center space-x-2 mb-4">
                <Badge variant="secondary">{post.category}</Badge>
                {post.featured && (
                  <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                    Featured
                  </Badge>
                )}
              </div>
              
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-slate-100 mb-4 leading-tight">
                {post.title}
              </h1>
              
              <p className="text-lg text-gray-600 dark:text-slate-300 mb-6">
                {post.excerpt}
              </p>
              
              {/* Author and meta info */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-slate-800 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
                <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                  <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 p-2 rounded-full">
                    <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-slate-100">
                      {post.author.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-slate-400">
                      @{post.author.handle}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-slate-400">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Eye className="h-4 w-4" />
                    <span>{post.views.toLocaleString()} views</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Article Content */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 sm:p-8 border border-gray-200 dark:border-slate-700 mb-8">
              <div 
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-slate-100 prose-p:text-gray-700 dark:prose-p:text-slate-300 prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-strong:text-gray-900 dark:prose-strong:text-slate-100"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Article Footer */}
            <footer className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700">
              {/* Tags */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-2">Tags:</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-slate-700">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLike}
                    className={liked ? 'text-red-600 border-red-200' : ''}
                  >
                    <Heart className={`h-4 w-4 mr-1 ${liked ? 'fill-current' : ''}`} />
                    {post.likes + (liked ? 1 : 0)}
                  </Button>
                  
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-1" />
                    Share
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleBookmark}
                    className={bookmarked ? 'text-blue-600 border-blue-200' : ''}
                  >
                    <Bookmark className={`h-4 w-4 mr-1 ${bookmarked ? 'fill-current' : ''}`} />
                    {bookmarked ? 'Saved' : 'Save'}
                  </Button>
                </div>
                
                <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-slate-400">
                  <ThumbsUp className="h-4 w-4" />
                  <span>{post.likes} likes</span>
                </div>
              </div>
            </footer>
          </article>

          {/* Author Bio */}
          <Card className="my-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/40 dark:to-purple-900/40 p-2 rounded-full">
                  <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg">About the Author</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400 font-normal">
                    {post.author.name} (@{post.author.handle})
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 dark:text-slate-300">{post.author.bio}</p>
            </CardContent>
          </Card>

          {/* Related Posts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Related Articles</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {relatedPosts.map((relatedPost) => (
                  <Card key={relatedPost.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <Badge variant="outline" className="w-fit mb-2">
                        {relatedPost.category}
                      </Badge>
                      <CardTitle className="text-base line-clamp-2">
                        <Link href={`/blog/${relatedPost.id}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                          {relatedPost.title}
                        </Link>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 dark:text-slate-300 mb-3 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center text-xs text-gray-500 dark:text-slate-400">
                        <Clock className="h-3 w-3 mr-1" />
                        {relatedPost.readTime}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}