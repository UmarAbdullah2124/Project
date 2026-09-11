'use client'

import { useState } from 'react'
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
import { InvoiceFormDialog } from '@/components/custom/invoice-form-dialog'
import { StatusPill } from '@/components/custom/status-pill'

const GET_INVOICES = gql`
  query GetInvoices {
    invoices {
      id
      amount
      status
      dueDate
      client {
        id
        name
      }
    }
  }
`

type Invoice = {
  id: string
  amount: number
  status: string
  dueDate: string
  client: { id: string; name: string }
}

const filterTabs = ['All', 'Pending', 'Paid', 'Overdue'] as const

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

function formatEpochString(value: string) {
  const timestamp = Number(value)
  if (Number.isNaN(timestamp)) return value
  return new Date(timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

function formatStatusLabel(status: string) {
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()
}

export default function InvoicesPage() {
  const { data, loading, error } = useQuery<{ invoices: Invoice[] }>(GET_INVOICES)
  const [activeTab, setActiveTab] = useState<(typeof filterTabs)[number]>('All')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Invoices</h1>
          <p className="text-sm text-gray-500">
            {data?.invoices?.length ?? 0} total invoices
          </p>
        </div>
        <InvoiceFormDialog />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input placeholder="Search invoices..." className="pl-9" />
        </div>

        <div className="flex items-center gap-1 rounded-lg bg-gray-100 p-1">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="border rounded-lg bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {error && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-red-500 py-8">
                  Failed to load invoices.
                </TableCell>
              </TableRow>
            )}
            {data?.invoices?.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                  No invoices yet. Create your first invoice to get started.
                </TableCell>
              </TableRow>
            )}
            {data?.invoices?.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-medium">{invoice.client.name}</TableCell>
                <TableCell>{currencyFormatter.format(invoice.amount)}</TableCell>
                <TableCell>
                  <StatusPill status={formatStatusLabel(invoice.status)} />
                </TableCell>
                <TableCell>{formatEpochString(invoice.dueDate)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
