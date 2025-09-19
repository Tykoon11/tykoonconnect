'use client'

export interface PaymentTransaction {
  id: string
  type: 'payment' | 'refund' | 'fee' | 'withdrawal' | 'deposit'
  amount: number
  currency: string
  status: 'completed' | 'pending' | 'failed' | 'cancelled'
  description: string
  recipientId?: string
  recipientName?: string
  senderId?: string
  senderName?: string
  jobId?: string
  jobTitle?: string
  contractId?: string
  paymentMethod: {
    type: 'card' | 'bank' | 'paypal' | 'stripe' | 'wallet'
    last4?: string
    brand?: string
  }
  fees: {
    platformFee: number
    processingFee: number
    total: number
  }
  metadata: {
    category: 'project_payment' | 'milestone' | 'bonus' | 'subscription' | 'refund'
    tags: string[]
    invoiceNumber?: string
    taxAmount?: number
  }
  createdAt: string
  completedAt?: string
  failureReason?: string
}

export interface PaymentAnalytics {
  totalSpent: number
  totalEarned: number
  totalFees: number
  netAmount: number
  transactionCount: number
  averageTransactionSize: number
  topCategories: {
    category: string
    amount: number
    count: number
    percentage: number
  }[]
  monthlyTrends: {
    month: string
    spent: number
    earned: number
    fees: number
    net: number
    transactionCount: number
  }[]
  paymentMethods: {
    method: string
    count: number
    totalAmount: number
    percentage: number
  }[]
  topClients: {
    clientId: string
    clientName: string
    totalPaid: number
    projectCount: number
    averageProjectValue: number
  }[]
  topFreelancers: {
    freelancerId: string
    freelancerName: string
    totalEarned: number
    projectCount: number
    averageProjectValue: number
  }[]
}

class PaymentAnalyticsService {
  private baseUrl = '/api/payments'

  // Get all transactions for a user
  async getTransactions(userId: string, filters?: {
    startDate?: string
    endDate?: string
    type?: PaymentTransaction['type']
    status?: PaymentTransaction['status']
    category?: string
    limit?: number
    offset?: number
  }): Promise<{ transactions: PaymentTransaction[], total: number }> {
    try {
      const queryParams = new URLSearchParams()
      if (filters?.startDate) queryParams.append('startDate', filters.startDate)
      if (filters?.endDate) queryParams.append('endDate', filters.endDate)
      if (filters?.type) queryParams.append('type', filters.type)
      if (filters?.status) queryParams.append('status', filters.status)
      if (filters?.category) queryParams.append('category', filters.category)
      if (filters?.limit) queryParams.append('limit', filters.limit.toString())
      if (filters?.offset) queryParams.append('offset', filters.offset.toString())

      const response = await fetch(`${this.baseUrl}/transactions/${userId}?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching transactions:', error)
      // Return demo data for development
      return this.getDemoTransactions(userId, filters)
    }
  }

  // Get payment analytics for a user
  async getAnalytics(userId: string, period?: '7d' | '30d' | '90d' | '1y' | 'all'): Promise<PaymentAnalytics> {
    try {
      const response = await fetch(`${this.baseUrl}/analytics/${userId}?period=${period || '30d'}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment analytics')
      }

      return await response.json()
    } catch (error) {
      console.error('Error fetching analytics:', error)
      // Return demo data for development
      return this.getDemoAnalytics(userId, period)
    }
  }

  // Process a new payment
  async processPayment(paymentData: {
    amount: number
    currency: string
    recipientId: string
    senderId: string
    jobId?: string
    description: string
    paymentMethodId: string
    metadata?: Record<string, any>
  }): Promise<PaymentTransaction> {
    try {
      const response = await fetch(`${this.baseUrl}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      })

      if (!response.ok) {
        throw new Error('Payment processing failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Error processing payment:', error)
      throw error
    }
  }

  // Request withdrawal
  async requestWithdrawal(userId: string, withdrawalData: {
    amount: number
    currency: string
    bankAccountId: string
    description?: string
  }): Promise<PaymentTransaction> {
    try {
      const response = await fetch(`${this.baseUrl}/withdraw`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, ...withdrawalData }),
      })

      if (!response.ok) {
        throw new Error('Withdrawal request failed')
      }

      return await response.json()
    } catch (error) {
      console.error('Error requesting withdrawal:', error)
      throw error
    }
  }

  // Export transaction data
  async exportTransactions(userId: string, format: 'csv' | 'pdf' | 'excel', filters?: any): Promise<Blob> {
    try {
      const queryParams = new URLSearchParams({ format, ...filters })
      const response = await fetch(`${this.baseUrl}/export/${userId}?${queryParams}`)
      
      if (!response.ok) {
        throw new Error('Export failed')
      }

      return await response.blob()
    } catch (error) {
      console.error('Error exporting transactions:', error)
      throw error
    }
  }

  // Demo data generators for development
  private getDemoTransactions(userId: string, filters?: any): { transactions: PaymentTransaction[], total: number } {
    const demoTransactions: PaymentTransaction[] = [
      {
        id: 'txn_001',
        type: 'payment',
        amount: 2500.00,
        currency: 'USD',
        status: 'completed',
        description: 'E-commerce Website Development - Final Payment',
        recipientId: 'freelancer_001',
        recipientName: 'Sarah Johnson',
        senderId: userId,
        senderName: 'TechCorp Inc.',
        jobId: 'job_001',
        jobTitle: 'E-commerce Website Development',
        contractId: 'contract_001',
        paymentMethod: {
          type: 'card',
          last4: '4242',
          brand: 'visa'
        },
        fees: {
          platformFee: 125.00,
          processingFee: 75.50,
          total: 200.50
        },
        metadata: {
          category: 'project_payment',
          tags: ['development', 'e-commerce', 'final-payment'],
          invoiceNumber: 'INV-001',
          taxAmount: 250.00
        },
        createdAt: '2024-09-10T10:30:00Z',
        completedAt: '2024-09-10T10:31:00Z'
      },
      {
        id: 'txn_002',
        type: 'payment',
        amount: 1200.00,
        currency: 'USD',
        status: 'completed',
        description: 'Brand Identity Design - Milestone 2',
        recipientId: 'freelancer_002',
        recipientName: 'Mike Chen',
        senderId: userId,
        senderName: 'Innovation Labs',
        jobId: 'job_002',
        jobTitle: 'Brand Identity Design Package',
        paymentMethod: {
          type: 'bank',
          last4: '7890'
        },
        fees: {
          platformFee: 60.00,
          processingFee: 36.00,
          total: 96.00
        },
        metadata: {
          category: 'milestone',
          tags: ['design', 'branding', 'milestone'],
          invoiceNumber: 'INV-002'
        },
        createdAt: '2024-09-08T14:15:00Z',
        completedAt: '2024-09-08T14:16:00Z'
      },
      {
        id: 'txn_003',
        type: 'refund',
        amount: -350.00,
        currency: 'USD',
        status: 'completed',
        description: 'Partial refund for delayed delivery',
        recipientId: userId,
        recipientName: 'TechCorp Inc.',
        senderId: 'freelancer_003',
        senderName: 'Alex Rodriguez',
        jobId: 'job_003',
        jobTitle: 'Mobile App UI/UX Design',
        paymentMethod: {
          type: 'card',
          last4: '1234',
          brand: 'mastercard'
        },
        fees: {
          platformFee: -17.50,
          processingFee: -10.50,
          total: -28.00
        },
        metadata: {
          category: 'refund',
          tags: ['refund', 'delay', 'ui-design']
        },
        createdAt: '2024-09-07T09:20:00Z',
        completedAt: '2024-09-07T09:22:00Z'
      },
      {
        id: 'txn_004',
        type: 'withdrawal',
        amount: -1800.00,
        currency: 'USD',
        status: 'pending',
        description: 'Weekly earnings withdrawal',
        senderId: userId,
        senderName: 'Your Account',
        paymentMethod: {
          type: 'bank',
          last4: '5678'
        },
        fees: {
          platformFee: 0,
          processingFee: 5.00,
          total: 5.00
        },
        metadata: {
          category: 'refund',
          tags: ['withdrawal', 'earnings']
        },
        createdAt: '2024-09-11T16:45:00Z'
      },
      {
        id: 'txn_005',
        type: 'payment',
        amount: 500.00,
        currency: 'USD',
        status: 'completed',
        description: 'Performance bonus for exceptional work',
        recipientId: 'freelancer_001',
        recipientName: 'Sarah Johnson',
        senderId: userId,
        senderName: 'TechCorp Inc.',
        jobId: 'job_001',
        jobTitle: 'E-commerce Website Development',
        paymentMethod: {
          type: 'paypal'
        },
        fees: {
          platformFee: 25.00,
          processingFee: 15.00,
          total: 40.00
        },
        metadata: {
          category: 'bonus',
          tags: ['bonus', 'performance', 'exceptional']
        },
        createdAt: '2024-09-12T11:20:00Z',
        completedAt: '2024-09-12T11:21:00Z'
      }
    ]

    return {
      transactions: demoTransactions,
      total: demoTransactions.length
    }
  }

  private getDemoAnalytics(userId: string, period?: string): PaymentAnalytics {
    return {
      totalSpent: 4200.00,
      totalEarned: 8750.00,
      totalFees: 308.50,
      netAmount: 4441.50,
      transactionCount: 15,
      averageTransactionSize: 583.33,
      topCategories: [
        { category: 'project_payment', amount: 3200.00, count: 8, percentage: 76.2 },
        { category: 'milestone', amount: 800.00, count: 4, percentage: 19.0 },
        { category: 'bonus', amount: 200.00, count: 3, percentage: 4.8 }
      ],
      monthlyTrends: [
        {
          month: '2024-06',
          spent: 1200.00,
          earned: 2100.00,
          fees: 85.50,
          net: 814.50,
          transactionCount: 4
        },
        {
          month: '2024-07',
          spent: 1800.00,
          earned: 2850.00,
          fees: 125.75,
          net: 924.25,
          transactionCount: 6
        },
        {
          month: '2024-08',
          spent: 800.00,
          earned: 1950.00,
          fees: 67.25,
          net: 1082.75,
          transactionCount: 3
        },
        {
          month: '2024-09',
          spent: 400.00,
          earned: 1850.00,
          fees: 30.00,
          net: 1420.00,
          transactionCount: 2
        }
      ],
      paymentMethods: [
        { method: 'Card (Visa)', count: 8, totalAmount: 2800.00, percentage: 66.7 },
        { method: 'Bank Transfer', count: 4, totalAmount: 1200.00, percentage: 28.6 },
        { method: 'PayPal', count: 3, totalAmount: 200.00, percentage: 4.7 }
      ],
      topClients: [
        {
          clientId: 'client_001',
          clientName: 'TechCorp Inc.',
          totalPaid: 3000.00,
          projectCount: 3,
          averageProjectValue: 1000.00
        },
        {
          clientId: 'client_002',
          clientName: 'Innovation Labs',
          totalPaid: 1200.00,
          projectCount: 2,
          averageProjectValue: 600.00
        }
      ],
      topFreelancers: [
        {
          freelancerId: 'freelancer_001',
          freelancerName: 'Sarah Johnson',
          totalEarned: 3000.00,
          projectCount: 4,
          averageProjectValue: 750.00
        },
        {
          freelancerId: 'freelancer_002',
          freelancerName: 'Mike Chen',
          totalEarned: 2100.00,
          projectCount: 3,
          averageProjectValue: 700.00
        }
      ]
    }
  }
}

export const paymentAnalyticsService = new PaymentAnalyticsService()