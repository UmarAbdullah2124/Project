'use client'

import dynamic from 'next/dynamic'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useTheme } from '@/lib/theme-provider'
import { StatCard } from '@/components/custom/stat-card'

function ChartSkeleton() {
  return (
    <div className="flex h-[260px] items-center justify-center">
      <div className="h-[220px] w-full animate-pulse rounded-md bg-gray-100 dark:bg-slate-800" />
    </div>
  )
}

const StatusBarChart = dynamic(
  () => import('@/components/custom/dashboard-charts').then((m) => m.StatusBarChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
)

const TopClientsBarChart = dynamic(
  () => import('@/components/custom/dashboard-charts').then((m) => m.TopClientsBarChart),
  { ssr: false, loading: () => <ChartSkeleton /> }
)

const GET_CLIENTS = gql`
  query GetClients {
    clients {
      id
      name
      industry
      status
      mrr
    }
  }
`

type Client = {
  id: string
  name: string
  industry: string | null
  status: string
  mrr: number
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      {children}
    </div>
  )
}

function EmptyChartState({ message }: { message: string }) {
  return (
    <div className="flex h-64 items-center justify-center text-sm text-gray-500 dark:text-gray-400">
      {message}
    </div>
  )
}

export default function DashboardPage() {
  const { theme } = useTheme()
  const isDark = theme === 'dark'
  const { data, loading, error } = useQuery<{ clients: Client[] }>(GET_CLIENTS)
  const clients = data?.clients ?? []

  const totalClients = clients.length
  const totalMrr = clients.reduce((sum, client) => sum + client.mrr, 0)
  const activeCount = clients.filter((c) => c.status === 'active').length
  const onboardingCount = clients.filter((c) => c.status === 'onboarding').length
  const inactiveCount = clients.filter((c) => c.status === 'inactive').length

  const statusData = [
    { status: 'Active', count: activeCount, key: 'active' },
    { status: 'Onboarding', count: onboardingCount, key: 'onboarding' },
    { status: 'Inactive', count: inactiveCount, key: 'inactive' },
  ]

  const topClients = [...clients]
    .sort((a, b) => b.mrr - a.mrr)
    .slice(0, 5)
    .reverse()

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Overview of your client portfolio</p>
        </div>
        <div className="rounded-lg border bg-white p-6 text-center text-sm text-gray-500 dark:border-slate-800 dark:bg-slate-900 dark:text-gray-400">
          Loading...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Overview of your client portfolio</p>
        </div>
        <div className="rounded-lg border bg-white p-6 text-center text-sm text-red-500 dark:border-slate-800 dark:bg-slate-900 dark:text-red-400">
          Failed to load dashboard data.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Overview of your client portfolio</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Clients" value={totalClients} />
        <StatCard label="Total MRR" value={currencyFormatter.format(totalMrr)} />
        <StatCard label="Active Clients" value={activeCount} />
        <StatCard label="Onboarding" value={onboardingCount} />
      </div>

      {totalClients === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center text-sm text-gray-500 dark:border-slate-800 dark:bg-slate-900 dark:text-gray-400">
          No clients yet. Add your first client to see portfolio insights here.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Clients by Status">
            <StatusBarChart data={statusData} isDark={isDark} />
          </ChartCard>

          <ChartCard title="Top Clients by MRR">
            {topClients.length === 0 ? (
              <EmptyChartState message="No MRR data yet." />
            ) : (
              <TopClientsBarChart data={topClients} isDark={isDark} currencyFormatter={currencyFormatter} />
            )}
          </ChartCard>
        </div>
      )}
    </div>
  )
}
