import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Users, Flag, Eye, DollarSign, Activity, Shield } from 'lucide-react'
import Link from 'next/link'

async function getAdminStats() {
  const [
    totalUsers,
    totalJobs,
    totalAgreements,
    totalDonations,
    pendingReports,
    recentAuditLogs
  ] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.agreement.count(),
    prisma.donation.aggregate({ _sum: { amount: true }, _count: true }),
    prisma.report.count({ where: { status: 'open' } }),
    prisma.auditLog.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: {
          select: { name: true, handle: true }
        }
      }
    })
  ])

  return {
    totalUsers,
    totalJobs,
    totalAgreements,
    totalDonations: {
      amount: totalDonations._sum.amount || 0,
      count: totalDonations._count
    },
    pendingReports,
    recentAuditLogs
  }
}

export default async function AdminPage() {
  const supabase = createClient()
  const { data: { user } } = supabase ? await supabase.auth.getUser() : { data: { user: null } }

  if (!user) {
    redirect('/auth/signin')
  }

  // Check if user is admin (you'll need to implement admin role checking)
  const userProfile = await prisma.user.findUnique({
    where: { id: user.id }
  })

  // For now, allow any authenticated user - in production, add proper admin checks
  if (!userProfile) {
    redirect('/auth/signin')
  }

  const stats = await getAdminStats()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalJobs.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agreements</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalAgreements.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Donations</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(stats.totalDonations.amount / 100).toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats.totalDonations.count} donations
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common moderation tasks</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/admin/reports">
                    <Flag className="mr-2 h-4 w-4" />
                    Review Reports ({stats.pendingReports})
                  </Link>
                </Button>
                
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/admin/users">
                    <Users className="mr-2 h-4 w-4" />
                    Manage Users
                  </Link>
                </Button>
                
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/admin/agreements">
                    <Eye className="mr-2 h-4 w-4" />
                    Monitor Agreements
                  </Link>
                </Button>
                
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/admin/donations">
                    <DollarSign className="mr-2 h-4 w-4" />
                    Donation Ledger
                  </Link>
                </Button>
                
                <Button className="w-full justify-start" variant="outline" asChild>
                  <Link href="/admin/feature-flags">
                    <Shield className="mr-2 h-4 w-4" />
                    Feature Flags
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Feature Flags */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Feature Flags</CardTitle>
                <CardDescription>Toggle platform features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Card Holds</span>
                  <Badge variant={process.env.FEATURE_CARD_HOLD === 'true' ? 'default' : 'secondary'}>
                    {process.env.FEATURE_CARD_HOLD === 'true' ? 'ON' : 'OFF'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Project Packs</span>
                  <Badge variant={process.env.FEATURE_PROJECT_PACKS === 'true' ? 'default' : 'secondary'}>
                    {process.env.FEATURE_PROJECT_PACKS === 'true' ? 'ON' : 'OFF'}
                  </Badge>
                </div>
                <Button size="sm" variant="outline" className="w-full" asChild>
                  <Link href="/admin/feature-flags">Manage Flags</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Audit Log</CardTitle>
                <CardDescription>Latest system activities and changes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentAuditLogs.map((log) => (
                    <div key={log.id} className="flex items-start space-x-3 pb-3 border-b last:border-b-0">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <Activity className="h-3 w-3 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">
                          {log.action}
                        </p>
                        <p className="text-xs text-gray-600">
                          {log.targetType}: {log.targetId}
                          {log.actor && (
                            <> • by {log.actor.name} (@{log.actor.handle})</>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(log.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {stats.recentAuditLogs.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p>No recent activity</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}