'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SimpleLineChart, BarChart, ProgressRing } from '@/components/ui/charts'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { paymentAnalyticsService, type PaymentTransaction, type PaymentAnalytics } from '@/lib/payment-analytics'
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Filter, 
  Search,
  CreditCard,
  Building,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  Eye,
  RefreshCw
} from 'lucide-react'

interface PaymentAnalyticsModalProps {
  isOpen: boolean
  onClose: () => void
  userId: string
  type: 'spending' | 'earnings' | 'overview'
  title: string
}

export function PaymentAnalyticsModal({ isOpen, onClose, userId, type, title }: PaymentAnalyticsModalProps) {
  const [analytics, setAnalytics] = useState<PaymentAnalytics | null>(null)
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState<'7d' | '30d' | '90d' | '1y' | 'all'>('30d')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  useEffect(() => {
    if (isOpen) {
      loadData()
    }
  }, [isOpen, selectedPeriod])

  const loadData = async () => {
    setLoading(true)
    try {
      // Load analytics and transactions in parallel
      const [analyticsData, transactionsData] = await Promise.all([
        paymentAnalyticsService.getAnalytics(userId, selectedPeriod),
        paymentAnalyticsService.getTransactions(userId, {
          limit: 50,
          status: statusFilter === 'all' ? undefined : statusFilter as any,
          type: typeFilter === 'all' ? undefined : typeFilter as any
        })
      ])

      setAnalytics(analyticsData)
      setTransactions(transactionsData.transactions)
    } catch (error) {
      console.error('Error loading payment data:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = searchTerm === '' || 
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.recipientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.senderName?.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesSearch
  })

  const handleExport = async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      const blob = await paymentAnalyticsService.exportTransactions(userId, format, {
        period: selectedPeriod,
        status: statusFilter,
        type: typeFilter
      })
      
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `transactions_${selectedPeriod}.${format}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Export failed:', error)
    }
  }

  const getStatusIcon = (status: PaymentTransaction['status']) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed': return <XCircle className="h-4 w-4 text-red-500" />
      case 'cancelled': return <AlertCircle className="h-4 w-4 text-gray-500" />
      default: return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getTransactionIcon = (txType: PaymentTransaction['type']) => {
    switch (txType) {
      case 'payment': return <ArrowUpRight className="h-4 w-4 text-red-500" />
      case 'refund': return <ArrowDownLeft className="h-4 w-4 text-green-500" />
      case 'withdrawal': return <ArrowDownLeft className="h-4 w-4 text-blue-500" />
      case 'deposit': return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case 'fee': return <MoreHorizontal className="h-4 w-4 text-gray-500" />
      default: return <MoreHorizontal className="h-4 w-4 text-gray-500" />
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    if (method.includes('card') || method.includes('Card')) return <CreditCard className="h-4 w-4" />
    if (method.includes('bank') || method.includes('Bank')) return <Building className="h-4 w-4" />
    return <Wallet className="h-4 w-4" />
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5" />
            <span>{title}</span>
          </DialogTitle>
          <DialogDescription>
            Detailed payment analytics and transaction history
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-wrap items-center gap-4">
              <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-64"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="payment">Payments</SelectItem>
                  <SelectItem value="refund">Refunds</SelectItem>
                  <SelectItem value="withdrawal">Withdrawals</SelectItem>
                  <SelectItem value="deposit">Deposits</SelectItem>
                  <SelectItem value="fee">Fees</SelectItem>
                </SelectContent>
              </Select>

              <Button onClick={loadData} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>

              <Button onClick={() => handleExport('csv')} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>

            {analytics && (
              <>
                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-red-600">
                        ${analytics.totalSpent.toLocaleString()}
                      </div>
                      <p className="text-xs text-gray-500">
                        {analytics.transactionCount} transactions
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-green-600">
                        ${analytics.totalEarned.toLocaleString()}
                      </div>
                      <p className="text-xs text-gray-500">
                        Avg: ${analytics.averageTransactionSize.toFixed(0)}
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Total Fees</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-orange-600">
                        ${analytics.totalFees.toLocaleString()}
                      </div>
                      <p className="text-xs text-gray-500">
                        Platform + processing
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className={`text-2xl font-bold ${analytics.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ${Math.abs(analytics.netAmount).toLocaleString()}
                      </div>
                      <p className="text-xs text-gray-500">
                        {analytics.netAmount >= 0 ? 'Profit' : 'Loss'}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Monthly Trends */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <TrendingUp className="h-5 w-5" />
                        <span>Monthly Trends</span>
                      </CardTitle>
                      <CardDescription>Spending and earnings over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SimpleLineChart 
                        data={analytics.monthlyTrends.map(trend => ({
                          x: trend.month,
                          y: trend.net
                        }))}
                        height={200}
                        color="#10B981"
                      />
                    </CardContent>
                  </Card>

                  {/* Payment Methods */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <CreditCard className="h-5 w-5" />
                        <span>Payment Methods</span>
                      </CardTitle>
                      <CardDescription>Distribution by payment method</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {analytics.paymentMethods.map((method, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {getPaymentMethodIcon(method.method)}
                              <span className="text-sm">{method.method}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium">${method.totalAmount.toLocaleString()}</div>
                              <div className="text-xs text-gray-500">{method.percentage.toFixed(1)}%</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Categories */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Categories</CardTitle>
                    <CardDescription>Breakdown by transaction category</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {analytics.topCategories.map((category, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium capitalize">{category.category.replace('_', ' ')}</div>
                            <div className="text-sm text-gray-500">{category.count} transactions</div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold">${category.amount.toLocaleString()}</div>
                            <div className="text-sm text-gray-500">{category.percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}

            {/* Transaction History */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  {filteredTransactions.length} of {transactions.length} transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getTransactionIcon(transaction.type)}
                          {getStatusIcon(transaction.status)}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium">{transaction.description}</div>
                          <div className="text-sm text-gray-500 flex items-center space-x-4">
                            <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                            {transaction.recipientName && (
                              <span>To: {transaction.recipientName}</span>
                            )}
                            {transaction.senderName && transaction.type !== 'payment' && (
                              <span>From: {transaction.senderName}</span>
                            )}
                            <span className="flex items-center space-x-1">
                              {getPaymentMethodIcon(transaction.paymentMethod.type)}
                              <span>{transaction.paymentMethod.type}</span>
                              {transaction.paymentMethod.last4 && (
                                <span>••••{transaction.paymentMethod.last4}</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-500">
                          Fee: ${transaction.fees.total.toFixed(2)}
                        </div>
                        <Badge variant={transaction.status === 'completed' ? 'default' : transaction.status === 'pending' ? 'secondary' : 'destructive'}>
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}