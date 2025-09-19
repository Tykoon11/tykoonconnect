/**
 * Professional Job Categories Library
 * Structured categorization system similar to Upwork for consistent job organization
 */

export interface JobCategory {
  id: string
  name: string
  description?: string
  skills: string[]
  subcategories?: JobSubcategory[]
}

export interface JobSubcategory {
  id: string
  name: string
  description?: string
  skills: string[]
}

export const JOB_CATEGORIES: JobCategory[] = [
  {
    id: 'web-development',
    name: 'Web Development',
    description: 'Frontend, backend, and full-stack web development',
    skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Node.js'],
    subcategories: [
      {
        id: 'frontend',
        name: 'Frontend Development',
        description: 'User interface and client-side development',
        skills: ['React', 'Vue.js', 'Angular', 'HTML', 'CSS', 'JavaScript', 'TypeScript', 'Sass', 'Tailwind CSS']
      },
      {
        id: 'backend',
        name: 'Backend Development', 
        description: 'Server-side development and APIs',
        skills: ['Node.js', 'Python', 'PHP', 'Java', 'C#', 'Ruby', 'Go', 'Express.js', 'Django', 'Laravel']
      },
      {
        id: 'fullstack',
        name: 'Full Stack Development',
        description: 'Complete web application development',
        skills: ['MEAN Stack', 'MERN Stack', 'LAMP Stack', 'Next.js', 'Nuxt.js', 'Django', 'Ruby on Rails']
      },
      {
        id: 'ecommerce',
        name: 'E-commerce Development',
        description: 'Online store and marketplace development',
        skills: ['Shopify', 'WooCommerce', 'Magento', 'Stripe', 'PayPal', 'BigCommerce', 'PrestaShop']
      }
    ]
  },
  {
    id: 'mobile-development',
    name: 'Mobile App Development',
    description: 'iOS, Android, and cross-platform mobile apps',
    skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic', 'Xamarin'],
    subcategories: [
      {
        id: 'ios',
        name: 'iOS Development',
        description: 'Native iOS app development',
        skills: ['Swift', 'Objective-C', 'Xcode', 'iOS SDK', 'Core Data', 'SwiftUI']
      },
      {
        id: 'android',
        name: 'Android Development',
        description: 'Native Android app development',
        skills: ['Kotlin', 'Java', 'Android Studio', 'Android SDK', 'Jetpack Compose']
      },
      {
        id: 'cross-platform',
        name: 'Cross-Platform Development',
        description: 'Multi-platform mobile apps',
        skills: ['React Native', 'Flutter', 'Ionic', 'Xamarin', 'Cordova', 'PhoneGap']
      }
    ]
  },
  {
    id: 'design-creative',
    name: 'Design & Creative',
    description: 'Visual design, branding, and creative services',
    skills: ['Graphic Design', 'UI/UX', 'Adobe Creative Suite', 'Figma', 'Sketch'],
    subcategories: [
      {
        id: 'ui-ux',
        name: 'UI/UX Design',
        description: 'User interface and experience design',
        skills: ['Figma', 'Sketch', 'Adobe XD', 'Principle', 'InVision', 'Framer', 'Wireframing', 'Prototyping']
      },
      {
        id: 'graphic-design',
        name: 'Graphic Design',
        description: 'Visual design and branding',
        skills: ['Adobe Photoshop', 'Adobe Illustrator', 'Adobe InDesign', 'Canva', 'CorelDRAW', 'GIMP']
      },
      {
        id: 'brand-identity',
        name: 'Brand Identity & Logo Design',
        description: 'Brand development and logo creation',
        skills: ['Logo Design', 'Brand Strategy', 'Visual Identity', 'Style Guides', 'Adobe Illustrator']
      },
      {
        id: 'web-design',
        name: 'Web Design',
        description: 'Website visual design and layouts',
        skills: ['Responsive Design', 'Landing Pages', 'WordPress Design', 'HTML/CSS', 'Bootstrap']
      }
    ]
  },
  {
    id: 'writing-content',
    name: 'Writing & Content',
    description: 'Content creation, copywriting, and technical writing',
    skills: ['Content Writing', 'Copywriting', 'SEO Writing', 'Technical Writing', 'Blogging'],
    subcategories: [
      {
        id: 'content-writing',
        name: 'Content Writing',
        description: 'Blog posts, articles, and web content',
        skills: ['Blog Writing', 'Article Writing', 'SEO Content', 'Web Copy', 'Content Strategy']
      },
      {
        id: 'copywriting',
        name: 'Copywriting',
        description: 'Marketing and sales copy',
        skills: ['Sales Copy', 'Email Marketing', 'Ad Copy', 'Landing Page Copy', 'Product Descriptions']
      },
      {
        id: 'technical-writing',
        name: 'Technical Writing',
        description: 'Documentation and technical content',
        skills: ['API Documentation', 'User Manuals', 'Software Documentation', 'Technical Guides']
      },
      {
        id: 'editing',
        name: 'Editing & Proofreading',
        description: 'Content editing and quality assurance',
        skills: ['Proofreading', 'Copy Editing', 'Content Editing', 'Grammar', 'Style Guides']
      }
    ]
  },
  {
    id: 'data-analytics',
    name: 'Data & Analytics',
    description: 'Data analysis, visualization, and business intelligence',
    skills: ['Python', 'R', 'SQL', 'Tableau', 'Power BI', 'Excel', 'Machine Learning'],
    subcategories: [
      {
        id: 'data-analysis',
        name: 'Data Analysis',
        description: 'Data processing and statistical analysis',
        skills: ['Python', 'R', 'SQL', 'Pandas', 'NumPy', 'Statistical Analysis', 'Excel']
      },
      {
        id: 'data-visualization',
        name: 'Data Visualization',
        description: 'Charts, dashboards, and visual analytics',
        skills: ['Tableau', 'Power BI', 'D3.js', 'Plotly', 'Matplotlib', 'Seaborn', 'Looker']
      },
      {
        id: 'machine-learning',
        name: 'Machine Learning & AI',
        description: 'ML models and artificial intelligence',
        skills: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Neural Networks', 'Deep Learning', 'NLP']
      },
      {
        id: 'database',
        name: 'Database Administration',
        description: 'Database design and management',
        skills: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Database Design', 'Query Optimization']
      }
    ]
  },
  {
    id: 'marketing-sales',
    name: 'Marketing & Sales',
    description: 'Digital marketing, SEO, and sales strategies',
    skills: ['Digital Marketing', 'SEO', 'SEM', 'Social Media Marketing', 'Email Marketing'],
    subcategories: [
      {
        id: 'digital-marketing',
        name: 'Digital Marketing Strategy',
        description: 'Comprehensive digital marketing planning',
        skills: ['Marketing Strategy', 'Campaign Management', 'Marketing Analytics', 'Growth Hacking']
      },
      {
        id: 'seo',
        name: 'SEO (Search Engine Optimization)',
        description: 'Organic search optimization',
        skills: ['On-page SEO', 'Off-page SEO', 'Keyword Research', 'Technical SEO', 'Link Building']
      },
      {
        id: 'social-media',
        name: 'Social Media Marketing',
        description: 'Social platform marketing and management',
        skills: ['Facebook Ads', 'Instagram Marketing', 'LinkedIn Marketing', 'Twitter Marketing', 'TikTok Marketing']
      },
      {
        id: 'ppc',
        name: 'PPC (Pay-Per-Click) Advertising',
        description: 'Paid advertising campaigns',
        skills: ['Google Ads', 'Facebook Ads', 'Microsoft Advertising', 'Campaign Optimization']
      }
    ]
  },
  {
    id: 'business-consulting',
    name: 'Business & Consulting',
    description: 'Business strategy, project management, and consulting',
    skills: ['Business Strategy', 'Project Management', 'Market Research', 'Financial Planning'],
    subcategories: [
      {
        id: 'strategy',
        name: 'Business Strategy',
        description: 'Strategic planning and business development',
        skills: ['Strategic Planning', 'Business Development', 'Market Analysis', 'Competitive Analysis']
      },
      {
        id: 'project-management',
        name: 'Project Management',
        description: 'Project planning and execution',
        skills: ['Agile', 'Scrum', 'Kanban', 'Jira', 'Asana', 'Monday.com', 'Project Planning']
      },
      {
        id: 'financial',
        name: 'Financial Services',
        description: 'Financial analysis and accounting',
        skills: ['Financial Modeling', 'Bookkeeping', 'QuickBooks', 'Excel Modeling', 'Budget Planning']
      }
    ]
  },
  {
    id: 'video-animation',
    name: 'Video & Animation',
    description: 'Video production, editing, and animation services',
    skills: ['Video Editing', 'Motion Graphics', '2D Animation', '3D Animation', 'After Effects'],
    subcategories: [
      {
        id: 'video-editing',
        name: 'Video Editing',
        description: 'Video post-production and editing',
        skills: ['Adobe Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve', 'After Effects', 'Avid']
      },
      {
        id: 'animation',
        name: 'Animation',
        description: '2D and 3D animation services',
        skills: ['After Effects', 'Cinema 4D', 'Blender', '2D Animation', '3D Animation', 'Motion Graphics']
      },
      {
        id: 'video-production',
        name: 'Video Production',
        description: 'Complete video production services',
        skills: ['Videography', 'Video Production', 'Scriptwriting', 'Storyboarding', 'Color Grading']
      }
    ]
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Specialized services and unique projects',
    skills: ['Custom Solutions', 'Specialized Services'],
    subcategories: [
      {
        id: 'translation',
        name: 'Translation & Languages',
        description: 'Language services and localization',
        skills: ['Translation', 'Localization', 'Proofreading', 'Interpretation', 'Multilingual Content']
      },
      {
        id: 'virtual-assistant',
        name: 'Virtual Assistant',
        description: 'Administrative and support services',
        skills: ['Administrative Support', 'Data Entry', 'Customer Support', 'Research', 'Email Management']
      },
      {
        id: 'legal',
        name: 'Legal Services',
        description: 'Legal research and documentation',
        skills: ['Legal Research', 'Contract Review', 'Legal Writing', 'Compliance', 'Intellectual Property']
      }
    ]
  }
]

// Budget ranges for consistent filtering
export const BUDGET_RANGES = [
  { id: 'under-500', label: 'Under $500', min: 0, max: 499 },
  { id: '500-1k', label: '$500 - $1,000', min: 500, max: 999 },
  { id: '1k-2k', label: '$1,000 - $2,000', min: 1000, max: 1999 },
  { id: '2k-5k', label: '$2,000 - $5,000', min: 2000, max: 4999 },
  { id: '5k-10k', label: '$5,000 - $10,000', min: 5000, max: 9999 },
  { id: '10k-plus', label: '$10,000+', min: 10000, max: Infinity }
]

// Project duration options
export const PROJECT_DURATIONS = [
  { id: 'less-than-1-month', label: 'Less than 1 month' },
  { id: '1-3-months', label: '1-3 months' },
  { id: '3-6-months', label: '3-6 months' },
  { id: 'more-than-6-months', label: 'More than 6 months' },
  { id: 'ongoing', label: 'Ongoing' }
]

// Experience levels
export const EXPERIENCE_LEVELS = [
  { id: 'entry', label: 'Entry Level', description: '0-2 years experience' },
  { id: 'intermediate', label: 'Intermediate', description: '2-5 years experience' },
  { id: 'expert', label: 'Expert', description: '5+ years experience' }
]

// Helper functions
export function getCategoryById(id: string): JobCategory | undefined {
  return JOB_CATEGORIES.find(cat => cat.id === id)
}

export function getSubcategoryById(categoryId: string, subcategoryId: string): JobSubcategory | undefined {
  const category = getCategoryById(categoryId)
  return category?.subcategories?.find(sub => sub.id === subcategoryId)
}

export function getAllSkills(): string[] {
  const skills = new Set<string>()
  
  JOB_CATEGORIES.forEach(category => {
    category.skills.forEach(skill => skills.add(skill))
    category.subcategories?.forEach(subcategory => {
      subcategory.skills.forEach(skill => skills.add(skill))
    })
  })
  
  return Array.from(skills).sort()
}

export function searchSkills(query: string, limit: number = 10): string[] {
  const allSkills = getAllSkills()
  const filtered = allSkills.filter(skill => 
    skill.toLowerCase().includes(query.toLowerCase())
  )
  return filtered.slice(0, limit)
}

export function categorizeJobBySkills(skills: string[]): JobCategory | null {
  let bestMatch: { category: JobCategory; score: number } | null = null
  
  JOB_CATEGORIES.forEach(category => {
    const categorySkills = new Set([
      ...category.skills,
      ...(category.subcategories?.flatMap(sub => sub.skills) || [])
    ])
    
    const matches = skills.filter(skill => 
      Array.from(categorySkills).some(catSkill => 
        catSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(catSkill.toLowerCase())
      )
    )
    
    const score = matches.length / skills.length
    
    if (!bestMatch || score > bestMatch.score) {
      bestMatch = { category, score }
    }
  })
  
  return bestMatch && bestMatch.score > 0.3 ? bestMatch.category : null
}