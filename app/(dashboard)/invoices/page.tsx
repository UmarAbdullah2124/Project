'use client'

import { useState } from 'react'
import { gql } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { InvoiceFormDialog } from '@/components/custom/invoice-form-dialog'
import { StatusPill } from '@/components/custom/status-pill'
import { DataTable, type DataTableColumn } from '@/components/custom/data-table'

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
  const [searchText, setSearchText] = useState('')

  const filteredInvoices = (data?.invoices ?? []).filter((invoice) => {
    const matchesSearch = invoice.client.name
      .toLowerCase()
      .includes(searchText.trim().toLowerCase())
    const matchesTab = activeTab === 'All' || invoice.status.toLowerCase() === activeTab.toLowerCase()
    return matchesSearch && matchesTab
  })
  const hasInvoices = (data?.invoices?.length ?? 0) > 0

  const columns: DataTableColumn<Invoice>[] = [
    {
      key: 'client',
      header: 'Client',
      render: (invoice) => invoice.client.name,
      className: 'font-medium',
    },
    {
      key: 'amount',
      header: 'Amount',
      render: (invoice) => currencyFormatter.format(invoice.amount),
    },
    {
      key: 'status',
      header: 'Status',
      render: (invoice) => <StatusPill status={formatStatusLabel(invoice.status)} />,
    },
    {
      key: 'dueDate',
      header: 'Due Date',
      render: (invoice) => formatEpochString(invoice.dueDate),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Invoices</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {data?.invoices?.length ?? 0} total invoices
          </p>
        </div>
        <InvoiceFormDialog />
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            placeholder="Search invoices..."
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

      <DataTable
        columns={columns}
        rows={filteredInvoices}
        getRowKey={(invoice) => invoice.id}
        loading={loading}
        error={!!error}
        errorMessage="Failed to load invoices."
        emptyMessage={
          !hasInvoices
            ? 'No invoices yet. Create your first invoice to get started.'
            : 'No results match your search/filter.'
        }
      />
    </div>
  )
}
