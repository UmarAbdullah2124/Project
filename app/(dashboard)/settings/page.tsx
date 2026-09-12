'use client'

import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useSession } from 'next-auth/react'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const GET_USERS = gql`
  query GetUsers {
    users {
      id
      name
      email
      role
      createdAt
    }
  }
`

type UserRow = {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
}

const roleStyles: Record<string, string> = {
  ADMIN:
    'bg-indigo-100 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:hover:bg-indigo-500/10',
  MANAGER:
    'bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/10',
  VIEWER:
    'bg-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-gray-500/10 dark:text-gray-400 dark:hover:bg-gray-500/10',
}

function formatRole(role: string) {
  return role.charAt(0).toUpperCase() + role.slice(1).toLowerCase()
}

function RoleBadge({ role }: { role: string }) {
  return (
    <Badge className={roleStyles[role] ?? roleStyles.VIEWER}>{formatRole(role)}</Badge>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const { data: session } = useSession()
  const isAdmin = session?.user?.role === 'ADMIN'

  const { data, loading, error } = useQuery<{ users: UserRow[] }>(GET_USERS, {
    skip: !isAdmin,
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your account and team</p>
      </div>

      <Card title="Profile">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-lg font-semibold text-white">
            {(session?.user?.name ?? session?.user?.email ?? 'U').charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-900 dark:text-gray-100">{session?.user?.name}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{session?.user?.email}</div>
          </div>
          {session?.user?.role && <RoleBadge role={session.user.role} />}
        </div>
      </Card>

      {isAdmin && (
        <Card title="Team">
          {loading && (
            <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">Loading...</p>
          )}
          {error && (
            <p className="py-4 text-center text-sm text-red-500 dark:text-red-400">Failed to load team.</p>
          )}
          {data?.users && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <RoleBadge role={user.role} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Card>
      )}
    </div>
  )
}
