import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Check if we're in demo mode (placeholder database URL)
const isDemoMode = !process.env.DATABASE_URL || 
  process.env.DATABASE_URL.includes('placeholder') ||
  process.env.DATABASE_URL.includes('localhost:5432/placeholder')

// Create a mock Prisma client for demo mode
const createMockPrisma = () => {
  const mockData = {
    jobs: [
      {
        id: 'demo-job-1',
        title: 'Demo Web Development Project',
        description: 'This is a demo job posting. In demo mode, all data is simulated.',
        skills: ['React', 'TypeScript', 'Node.js'],
        budgetType: 'fixed',
        budgetAmount: 5000,
        status: 'open',
        createdAt: new Date(),
        client: {
          name: 'Demo Client',
          handle: 'democlient',
          location: 'Demo City',
          ratingAverage: 4.8,
          ratingCount: 25
        },
        _count: { proposals: 3 }
      }
    ],
    users: []
  }

  return {
    job: {
      findMany: async () => mockData.jobs,
      count: async () => mockData.jobs.length,
      create: async (data: any) => ({ id: 'demo-job-' + Date.now(), ...data.data }),
      findUnique: async () => mockData.jobs[0],
      update: async (params: any) => ({ ...mockData.jobs[0], ...params.data }),
      delete: async () => mockData.jobs[0]
    },
    user: {
      findUnique: async () => null,
      create: async (data: any) => ({ id: 'demo-user-' + Date.now(), ...data.data }),
      update: async (params: any) => ({ id: 'demo-user', ...params.data }),
      findMany: async () => mockData.users
    },
    proposal: {
      findMany: async () => [],
      create: async (data: any) => ({ id: 'demo-proposal-' + Date.now(), ...data.data }),
      count: async () => 0
    },
    thread: {
      findMany: async () => [],
      create: async (data: any) => ({ id: 'demo-thread-' + Date.now(), ...data.data })
    },
    message: {
      findMany: async () => [],
      create: async (data: any) => ({ id: 'demo-message-' + Date.now(), ...data.data })
    },
    agreement: {
      findMany: async () => [],
      create: async (data: any) => ({ id: 'demo-agreement-' + Date.now(), ...data.data })
    },
    interest: {
      findMany: async () => [],
      create: async (data: any) => ({ id: 'demo-interest-' + Date.now(), ...data.data }),
      count: async () => 0
    },
    dailyInterestLimit: {
      findUnique: async () => null,
      create: async (data: any) => ({ id: 'demo-limit-' + Date.now(), ...data.data }),
      update: async (params: any) => ({ id: 'demo-limit', ...params.data })
    },
    donation: {
      findMany: async () => [],
      create: async (data: any) => ({ id: 'demo-donation-' + Date.now(), ...data.data })
    },
    report: {
      findMany: async () => [],
      create: async (data: any) => ({ id: 'demo-report-' + Date.now(), ...data.data })
    },
    auditLog: {
      create: async (data: any) => ({ id: 'demo-audit-' + Date.now(), ...data.data })
    },
    rateLimit: {
      findUnique: async () => null,
      create: async (data: any) => ({ id: 'demo-rate-' + Date.now(), ...data.data }),
      update: async (params: any) => ({ id: 'demo-rate', ...params.data })
    }
  } as any
}

export const prisma = isDemoMode 
  ? createMockPrisma()
  : (globalForPrisma.prisma ??
    new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
      errorFormat: 'pretty'
    }))

if (process.env.NODE_ENV !== 'production' && !isDemoMode) {
  globalForPrisma.prisma = prisma as PrismaClient
}

// Export demo mode flag for other modules to use
export const DEMO_MODE = isDemoMode