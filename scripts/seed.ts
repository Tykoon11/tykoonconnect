import { PrismaClient, AssuranceMethod } from '@prisma/client'
import { createClient } from '@supabase/supabase-js'

const prisma = new PrismaClient()

// Initialize Supabase for admin operations
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

async function main() {
  console.log('🌱 Starting seed...')

  // Create test users with different assurance preferences
  const users = [
    {
      id: 'user_client_1',
      email: 'alice@example.com',
      name: 'Alice Johnson',
      handle: 'alicej',
      roleClient: true,
      roleFreelancer: false,
      location: 'San Francisco, CA',
      bio: 'Startup founder looking for talented developers',
      preferredAssurance: 'MILESTONE_INVOICE' as AssuranceMethod,
      alsoAccepts: ['EXTERNAL_ESCROW'] as AssuranceMethod[]
    },
    {
      id: 'user_client_2',
      email: 'bob@example.com',
      name: 'Bob Wilson',
      handle: 'bobw',
      roleClient: true,
      roleFreelancer: false,
      location: 'Austin, TX',
      bio: 'Marketing agency owner',
      preferredAssurance: 'EXTERNAL_ESCROW' as AssuranceMethod,
      alsoAccepts: ['CARD_HOLD', 'MILESTONE_INVOICE'] as AssuranceMethod[]
    },
    {
      id: 'user_client_3',
      email: 'carol@example.com',
      name: 'Carol Davis',
      handle: 'carold',
      roleClient: true,
      roleFreelancer: false,
      location: 'New York, NY',
      bio: 'E-commerce business owner',
      preferredAssurance: 'CARD_HOLD' as AssuranceMethod,
      alsoAccepts: ['MILESTONE_INVOICE'] as AssuranceMethod[]
    },
    {
      id: 'user_freelancer_1',
      email: 'david@example.com',
      name: 'David Chen',
      handle: 'davidc',
      roleClient: false,
      roleFreelancer: true,
      location: 'Seattle, WA',
      bio: 'Full-stack developer with 5+ years experience',
      skills: ['React', 'Node.js', 'PostgreSQL', 'TypeScript'],
      languages: ['English', 'Mandarin'],
      preferredAssurance: 'MILESTONE_INVOICE' as AssuranceMethod,
      alsoAccepts: ['EXTERNAL_ESCROW'] as AssuranceMethod[]
    },
    {
      id: 'user_freelancer_2',
      email: 'eva@example.com',
      name: 'Eva Rodriguez',
      handle: 'evar',
      roleClient: false,
      roleFreelancer: true,
      location: 'Barcelona, Spain',
      bio: 'UI/UX Designer specializing in SaaS products',
      skills: ['Figma', 'Adobe Creative Suite', 'Prototyping', 'User Research'],
      languages: ['English', 'Spanish', 'French'],
      preferredAssurance: 'EXTERNAL_ESCROW' as AssuranceMethod,
      alsoAccepts: ['MILESTONE_INVOICE'] as AssuranceMethod[]
    },
    {
      id: 'user_freelancer_3',
      email: 'frank@example.com',
      name: 'Frank Miller',
      handle: 'frankm',
      roleClient: true,
      roleFreelancer: true,
      location: 'London, UK',
      bio: 'Content writer and digital marketer',
      skills: ['Content Writing', 'SEO', 'Social Media', 'Email Marketing'],
      languages: ['English'],
      preferredAssurance: 'CARD_HOLD' as AssuranceMethod,
      alsoAccepts: ['MILESTONE_INVOICE', 'EXTERNAL_ESCROW'] as AssuranceMethod[]
    }
  ]

  // Create users
  for (const userData of users) {
    await prisma.user.upsert({
      where: { id: userData.id },
      update: {},
      create: userData
    })
    console.log(`✅ Created user: ${userData.name} (@${userData.handle})`)
  }

  // Create jobs across different categories
  const jobs = [
    {
      clientId: 'user_client_1',
      title: 'E-commerce Website Development',
      description: 'Looking for a full-stack developer to build a modern e-commerce website using React and Node.js. The site needs to handle payments, inventory management, and user accounts. Must be responsive and SEO-friendly.',
      skills: ['React', 'Node.js', 'PostgreSQL', 'Stripe Integration'],
      budgetType: 'fixed',
      budgetAmount: 5000,
      assuranceHint: 'MILESTONE_INVOICE' as AssuranceMethod,
      status: 'open'
    },
    {
      clientId: 'user_client_2',
      title: 'Brand Identity Design Package',
      description: 'Need a complete brand identity package including logo design, color palette, typography, and brand guidelines. Looking for a modern, professional look for a tech startup.',
      skills: ['Logo Design', 'Brand Identity', 'Adobe Illustrator', 'Figma'],
      budgetType: 'fixed',
      budgetAmount: 2500,
      assuranceHint: 'EXTERNAL_ESCROW' as AssuranceMethod,
      status: 'open'
    },
    {
      clientId: 'user_client_3',
      title: 'Mobile App UI/UX Design',
      description: 'Design the user interface and user experience for a fitness tracking mobile app. Need wireframes, high-fidelity mockups, and interactive prototypes for iOS and Android.',
      skills: ['Mobile Design', 'UI/UX', 'Figma', 'Prototyping'],
      budgetType: 'fixed',
      budgetAmount: 3500,
      assuranceHint: 'CARD_HOLD' as AssuranceMethod,
      status: 'open'
    },
    {
      clientId: 'user_client_1',
      title: 'Content Marketing Strategy',
      description: 'Looking for an experienced content marketer to develop a comprehensive content strategy including blog posts, social media content, and email campaigns.',
      skills: ['Content Strategy', 'SEO', 'Social Media', 'Email Marketing'],
      budgetType: 'hourly',
      budgetAmount: 75,
      assuranceHint: 'MILESTONE_INVOICE' as AssuranceMethod,
      status: 'open'
    },
    {
      clientId: 'user_client_2',
      title: 'WordPress Plugin Development',
      description: 'Need a custom WordPress plugin developed for appointment booking with calendar integration, payment processing, and email notifications.',
      skills: ['WordPress', 'PHP', 'MySQL', 'JavaScript'],
      budgetType: 'fixed',
      budgetAmount: 1500,
      status: 'open'
    }
  ]

  for (const jobData of jobs) {
    const job = await prisma.job.create({ data: jobData })
    console.log(`✅ Created job: ${jobData.title}`)

    // Create some proposals for each job
    const freelancerIds = ['user_freelancer_1', 'user_freelancer_2', 'user_freelancer_3']
    const randomFreelancers = freelancerIds
      .sort(() => 0.5 - Math.random())
      .slice(0, Math.floor(Math.random() * 2) + 1)

    for (const freelancerId of randomFreelancers) {
      const freelancer = users.find(u => u.id === freelancerId)
      await prisma.proposal.create({
        data: {
          jobId: job.id,
          freelancerId,
          cover: `Hi! I'm ${freelancer?.name} and I'd love to work on your ${jobData.title.toLowerCase()} project. I have extensive experience with ${jobData.skills.slice(0, 2).join(' and ')} and can deliver high-quality results within your timeline.`,
          price: jobData.budgetType === 'fixed' ? jobData.budgetAmount : undefined,
          timelineDays: Math.floor(Math.random() * 21) + 7, // 7-28 days
          status: 'sent'
        }
      })
    }
  }

  // Create a few sample agreements in different states
  const sampleAgreement = await prisma.agreement.create({
    data: {
      jobId: (await prisma.job.findFirst())!.id,
      proposalId: (await prisma.proposal.findFirst())!.id,
      clientId: 'user_client_1',
      freelancerId: 'user_freelancer_1',
      scopeSummary: 'Build e-commerce website with React, Node.js, and PostgreSQL',
      acceptanceChecklist: [
        { id: '1', text: 'Homepage with hero section and navigation', required: true },
        { id: '2', text: 'Product catalog with search and filters', required: true },
        { id: '3', text: 'Shopping cart and checkout flow', required: true },
        { id: '4', text: 'User registration and login', required: true },
        { id: '5', text: 'Admin panel for inventory management', required: false }
      ],
      priceTotal: 5000,
      assuranceMethod: 'MILESTONE_INVOICE',
      assuranceState: 'SECURED',
      milestoneJson: [
        {
          id: 'm1',
          title: 'Project Setup & Homepage',
          amount: 1500,
          description: 'Initial setup, homepage design and development',
          receiptId: 'receipt_001',
          paidStatus: true
        },
        {
          id: 'm2',
          title: 'Product Catalog',
          amount: 2000,
          description: 'Product listing, search, and filtering functionality',
          paidStatus: false
        },
        {
          id: 'm3',
          title: 'Cart & Checkout',
          amount: 1500,
          description: 'Shopping cart and complete checkout flow',
          paidStatus: false
        }
      ]
    }
  })

  console.log(`✅ Created sample agreement: ${sampleAgreement.id}`)

  // Create sample donations for Wall of Support
  const donations = [
    {
      donorName: 'Sarah Mitchell',
      donorEmail: 'sarah@example.com',
      amount: 5000, // $50.00
      provider: 'stripe',
      providerId: 'ch_stripe_123',
      message: 'Love the zero-fee model! Keep up the great work!',
      showOnWall: true
    },
    {
      donorName: 'Anonymous',
      amount: 2500, // $25.00
      provider: 'paypal',
      providerId: 'paypal_456',
      message: 'This is the future of freelancing!',
      showOnWall: true
    },
    {
      donorName: 'Mike Thompson',
      donorEmail: 'mike@example.com',
      amount: 10000, // $100.00
      provider: 'stripe',
      providerId: 'ch_stripe_789',
      message: 'Finally, a platform that puts freelancers first.',
      showOnWall: true
    },
    {
      donorName: 'Jessica Chen',
      donorEmail: 'jessica@example.com',
      amount: 1000, // $10.00
      provider: 'stripe',
      providerId: 'ch_stripe_101',
      showOnWall: false
    }
  ]

  for (const donation of donations) {
    await prisma.donation.create({ data: donation })
    console.log(`✅ Created donation: $${donation.amount / 100} from ${donation.donorName}`)
  }

  console.log('🎉 Seed completed successfully!')
  console.log('\n📋 Summary:')
  console.log(`- ${users.length} users created`)
  console.log(`- ${jobs.length} jobs created`)
  console.log(`- Multiple proposals created`)
  console.log(`- 1 sample agreement created`)
  console.log(`- ${donations.length} donations created`)
  console.log('\n🔗 You can now:')
  console.log('1. Visit http://localhost:3000 to see the homepage')
  console.log('2. Go to /jobs to browse sample jobs')
  console.log('3. Visit /donations to see the Wall of Support')
  console.log('4. Use /admin to access moderation tools')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })