'use client'

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

const STATUS_COLORS: Record<string, string> = {
  active: '#22c55e',
  onboarding: '#f59e0b',
  inactive: '#9ca3af',
}

export type StatusDatum = { status: string; count: number; key: string }
export type TopClientDatum = { id: string; name: string; mrr: number }

export function StatusBarChart({ data, isDark }: { data: StatusDatum[]; isDark: boolean }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid
          strokeDasharray="3 3"
          vertical={false}
          stroke={isDark ? '#334155' : '#f1f5f9'}
        />
        <XAxis
          dataKey="status"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#6b7280' }}
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#6b7280' }}
        />
        <Tooltip
          cursor={{ fill: isDark ? '#1e293b' : '#f9fafb' }}
          contentStyle={
            isDark
              ? { backgroundColor: '#0f172a', border: '1px solid #334155', color: '#e2e8f0' }
              : undefined
          }
          labelStyle={isDark ? { color: '#e2e8f0' } : undefined}
        />
        <Bar dataKey="count" radius={[6, 6, 0, 0]} maxBarSize={64}>
          {data.map((entry) => (
            <Cell key={entry.key} fill={STATUS_COLORS[entry.key]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}

export function TopClientsBarChart({
  data,
  isDark,
  currencyFormatter,
}: {
  data: TopClientDatum[]
  isDark: boolean
  currencyFormatter: Intl.NumberFormat
}) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={false}
          stroke={isDark ? '#334155' : '#f1f5f9'}
        />
        <XAxis
          type="number"
          tickLine={false}
          axisLine={false}
          tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#6b7280' }}
          tickFormatter={(value) => currencyFormatter.format(value)}
        />
        <YAxis
          type="category"
          dataKey="name"
          tickLine={false}
          axisLine={false}
          width={100}
          tick={{ fontSize: 12, fill: isDark ? '#94a3b8' : '#6b7280' }}
        />
        <Tooltip
          cursor={{ fill: isDark ? '#1e293b' : '#f9fafb' }}
          formatter={(value) => currencyFormatter.format(Number(value))}
          contentStyle={
            isDark
              ? { backgroundColor: '#0f172a', border: '1px solid #334155', color: '#e2e8f0' }
              : undefined
          }
          labelStyle={isDark ? { color: '#e2e8f0' } : undefined}
        />
        <Bar dataKey="mrr" radius={[0, 6, 6, 0]} fill="#4f46e5" maxBarSize={24} />
      </BarChart>
    </ResponsiveContainer>
  )
}
