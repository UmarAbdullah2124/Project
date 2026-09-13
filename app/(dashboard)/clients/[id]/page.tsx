'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { useSession } from 'next-auth/react'
import { ArrowLeft, Mail, Phone } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatusPill } from '@/components/custom/status-pill'
import { EditClientDialog } from '@/components/custom/edit-client-dialog'

const GET_CLIENT = gql`
  query GetClient($id: ID!) {
    client(id: $id) {
      id
      name
      industry
      contactEmail
      contactPhone
      status
      mrr
      createdAt
      accountManager {
        id
        name
        email
      }
      projects {
        id
        title
        status
      }
      invoices {
        id
        amount
        status
        dueDate
      }
    }
  }
`

type AccountManager = {
  id: string
  name: string
  email: string
}

type Project = {
  id: string
  title: string
  status: string
}

type Invoice = {
  id: string
  amount: number
  status: string
  dueDate: string
}

type ClientDetail = {
  id: string
  name: string
  industry: string | null
  contactEmail: string | null
  contactPhone: string | null
  status: string
  mrr: number
  createdAt: string
  accountManager: AccountManager | null
  projects: Project[]
  invoices: Invoice[]
}

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
})

function formatEnumLabel(value: string) {
  return value
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const projectStatusStyles: Record<string, string> = {
  NOT_STARTED:
    'bg-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-gray-500/10 dark:text-gray-400 dark:hover:bg-gray-500/10',
  IN_PROGRESS:
    'bg-blue-100 text-blue-700 hover:bg-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:hover:bg-blue-500/10',
  REVIEW:
    'bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/10',
  DONE: 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/10',
}

const invoiceStatusStyles: Record<string, string> = {
  PENDING:
    'bg-amber-100 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/10',
  PAID: 'bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-500/10 dark:text-green-400 dark:hover:bg-green-500/10',
  OVERDUE:
    'bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/10',
}

function formatEpochString(value: string) {
  const timestamp = Number(value)
  if (Number.isNaN(timestamp)) return value
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      {children}
    </div>
  )
}

export default function ClientDetailPage() {
  const params = useParams<{ id: string }>()
  const { data: session } = useSession()
  const [editOpen, setEditOpen] = useState(false)
  const { data, loading, error } = useQuery<{ client: ClientDetail | null }>(GET_CLIENT, {
    variables: { id: params.id },
  })

  const client = data?.client
  const isViewer = session?.user?.role === 'VIEWER'

  return (
    <div className="space-y-6">
      <Link
        href="/clients"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
      >
        <ArrowLeft size={16} />
        Back to Clients
      </Link>

      {loading && (
        <div className="rounded-lg border bg-white p-6 text-center text-sm text-gray-500 dark:border-slate-800 dark:bg-slate-900 dark:text-gray-400">
          Loading...
        </div>
      )}

      {error && (
        <div className="rounded-lg border bg-white p-6 text-center text-sm text-red-500 dark:border-slate-800 dark:bg-slate-900 dark:text-red-400">
          Failed to load client.
        </div>
      )}

      {!loading && !error && !client && (
        <div className="rounded-lg border bg-white p-6 text-center text-sm text-gray-500 dark:border-slate-800 dark:bg-slate-900 dark:text-gray-400">
          Client not found.
        </div>
      )}

      {client && (
        <>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{client.name}</h1>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  {client.industry && <span>{client.industry}</span>}
                  <StatusPill status={client.status} />
                </div>
              </div>
            </div>
            {!isViewer && (
              <Button variant="outline" onClick={() => setEditOpen(true)}>
                Edit
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-1">
              <Card title="Contact Info">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Mail size={16} className="text-gray-400 dark:text-gray-500" />
                    {client.contactEmail || (
                      <span className="text-gray-600 dark:text-gray-400">Not provided</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <Phone size={16} className="text-gray-400 dark:text-gray-500" />
                    {client.contactPhone || (
                      <span className="text-gray-600 dark:text-gray-400">Not provided</span>
                    )}
                  </div>
                </div>
              </Card>

              <Card title="MRR">
                <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                  {currencyFormatter.format(client.mrr)}
                </div>
              </Card>

              <Card title="Account Manager">
                {client.accountManager ? (
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-sm font-semibold text-white">
                      {client.accountManager.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {client.accountManager.name}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {client.accountManager.email}
                      </div>
                    </div>
                  </div>
                ) : (
                  <span className="text-sm text-gray-600 dark:text-gray-400">Unassigned</span>
                )}
              </Card>
            </div>

            <div className="space-y-6 lg:col-span-2">
              <Card title="Projects">
                {client.projects.length === 0 ? (
                  <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">No projects yet</p>
                ) : (
                  <div className="divide-y dark:divide-slate-800">
                    {client.projects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                      >
                        <span className="font-medium text-gray-900 dark:text-gray-100">{project.title}</span>
                        <Badge
                          className={
                            projectStatusStyles[project.status] ??
                            'bg-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-gray-500/10 dark:text-gray-400 dark:hover:bg-gray-500/10'
                          }
                        >
                          {formatEnumLabel(project.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card title="Invoices">
                {client.invoices.length === 0 ? (
                  <p className="py-4 text-center text-sm text-gray-500 dark:text-gray-400">No invoices yet</p>
                ) : (
                  <div className="divide-y dark:divide-slate-800">
                    {client.invoices.map((invoice) => (
                      <div
                        key={invoice.id}
                        className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                      >
                        <div>
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {currencyFormatter.format(invoice.amount)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            Due {formatEpochString(invoice.dueDate)}
                          </div>
                        </div>
                        <Badge
                          className={
                            invoiceStatusStyles[invoice.status] ??
                            'bg-gray-100 text-gray-600 hover:bg-gray-100 dark:bg-gray-500/10 dark:text-gray-400 dark:hover:bg-gray-500/10'
                          }
                        >
                          {formatEnumLabel(invoice.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          </div>

          <EditClientDialog client={client} open={editOpen} onOpenChange={setEditOpen} />
        </>
      )}
    </div>
  )
}
