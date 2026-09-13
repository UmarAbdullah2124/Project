import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { DataTable, type DataTableColumn } from './data-table'

type SampleRow = {
  id: string
  name: string
  status: string
  amount: string
}

const columns: DataTableColumn<SampleRow>[] = [
  { key: 'name', header: 'Name', render: (row) => row.name, className: 'font-medium' },
  { key: 'status', header: 'Status', render: (row) => row.status },
  { key: 'amount', header: 'Amount', render: (row) => row.amount },
]

const sampleRows: SampleRow[] = [
  { id: '1', name: 'Acme Corp', status: 'Active', amount: '$1,200' },
  { id: '2', name: 'Globex Inc', status: 'Onboarding', amount: '$5,000' },
  { id: '3', name: 'Initech', status: 'Inactive', amount: '$0' },
]

const meta: Meta<typeof DataTable<SampleRow>> = {
  title: 'Custom/DataTable',
  component: DataTable<SampleRow>,
}

export default meta
type Story = StoryObj<typeof DataTable<SampleRow>>

export const WithData: Story = {
  args: {
    columns,
    rows: sampleRows,
    getRowKey: (row: SampleRow) => row.id,
  },
}

export const Empty: Story = {
  args: {
    columns,
    rows: [],
    getRowKey: (row: SampleRow) => row.id,
    emptyMessage: 'No results found.',
  },
}
