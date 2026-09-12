'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { ClientFormDialog } from '@/components/custom/client-form-dialog'
import { StatusPill } from '@/components/custom/status-pill'

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

const filterTabs = ['All', 'Active', 'Onboarding', 'Inactive'] as const

export default function ClientsPage() {
  const router = useRouter()
  const { data, loading, error } = useQuery<{ clients: Client[] }>(GET_CLIENTS)
  const [activeTab, setActiveTab] = useState<(typeof filterTabs)[number]>('All')
  const [searchText, setSearchText] = useState('')

  const filteredClients = (data?.clients ?? []).filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchText.trim().toLowerCase())
    const matchesTab = activeTab === 'All' || client.status.toLowerCase() === activeTab.toLowerCase()
    return matchesSearch && matchesTab
  })
  const hasClients = (data?.clients?.length ?? 0) > 0
  const hasFilteredResults = filteredClients.length > 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Clients</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {data?.clients?.length ?? 0} total clients
          </p>
        </div>
        <ClientFormDialog />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search clients..."
            className="pl-9"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1 dark:bg-slate-800">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm dark:bg-slate-700 dark:text-gray-100'
                  : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="border rounded-lg bg-white dark:border-slate-800 dark:bg-slate-900">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Industry</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>MRR</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-8 dark:text-gray-400">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-red-500 py-8 dark:text-red-400">
                  Failed to load clients.
                </TableCell>
              </TableRow>
            )}
            {!loading && !error && !hasClients && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-8 dark:text-gray-400">
                  No clients yet. Add your first client to get started.
                </TableCell>
              </TableRow>
            )}
            {!loading && !error && hasClients && !hasFilteredResults && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-8 dark:text-gray-400">
                  No results match your search/filter.
                </TableCell>
              </TableRow>
            )}
            {filteredClients.map((client) => (
              <TableRow
                key={client.id}
                onClick={() => router.push(`/clients/${client.id}`)}
                className="cursor-pointer"
              >
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>{client.industry}</TableCell>
                <TableCell>
                  <StatusPill status={client.status} />
                </TableCell>
                <TableCell>${client.mrr.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
