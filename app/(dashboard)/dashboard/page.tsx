'use client'

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

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

const STATUS_COLORS: Record<string, string> = {
  active: '#22c55e',
  onboarding: '#f59e0b',
  inactive: '#9ca3af',
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <div className="text-sm text-gray-500">{label}</div>
      <div className="mt-2 text-3xl font-bold text-gray-900">{value}</div>
    </div>
  )
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-white p-6">
      <h2 className="mb-4 text-sm font-semibold text-gray-900">{title}</h2>
      {children}
    </div>
  )
}

function EmptyChartState({ message }: { message: string }) {
  return (
    <div className="flex h-64 items-center justify-center text-sm text-gray-500">
      {message}
    </div>
  )
}

export default function DashboardPage() {
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
          <p className="text-sm text-gray-500">Overview of your client portfolio</p>
        </div>
        <div className="rounded-lg border bg-white p-6 text-center text-sm text-gray-500">
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
          <p className="text-sm text-gray-500">Overview of your client portfolio</p>
        </div>
        <div className="rounded-lg border bg-white p-6 text-center text-sm text-red-500">
          Failed to load dashboard data.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-gray-500">Overview of your client portfolio</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Clients" value={totalClients} />
        <StatCard label="Total MRR" value={currencyFormatter.format(totalMrr)} />
        <StatCard label="Active Clients" value={activeCount} />
        <StatCard label="Onboarding" value={onboardingCount} />
      </div>

      {totalClients === 0 ? (
        <div className="rounded-lg border bg-white p-12 text-center text-sm text-gray-500">
          No clients yet. Add your first client to see portfolio insights here.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <ChartCard title="Clients by Status">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="status" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                <Tooltip cursor={{ fill: '#f9fafb' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={64}>
                  {statusData.map((entry) => (
                    <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Top Clients by MRR">
            {topClients.length === 0 ? (
              <EmptyChartState message="No MRR data yet." />
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={topClients} layout="vertical" margin={{ left: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                  <XAxis
                    type="number"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => currencyFormatter.format(value)}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    width={100}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <Tooltip
                    cursor={{ fill: '#f9fafb' }}
                    formatter={(value) => currencyFormatter.format(Number(value))}
                  />
                  <Bar dataKey="mrr" radius={[0, 6, 6, 0]} fill="#4f46e5" maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </div>
      )}
    </div>
  )
}
