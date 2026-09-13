import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export type DataTableColumn<T> = {
  key: string
  header: string
  render: (row: T) => React.ReactNode
  className?: string
}

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[]
  rows: T[]
  getRowKey: (row: T) => string
  onRowClick?: (row: T) => void
  loading?: boolean
  error?: boolean
  errorMessage?: string
  emptyMessage?: string
}

export function DataTable<T>({
  columns,
  rows,
  getRowKey,
  onRowClick,
  loading = false,
  error = false,
  errorMessage = 'Failed to load data.',
  emptyMessage = 'No results found.',
}: DataTableProps<T>) {
  return (
    <div className="border rounded-lg bg-white dark:border-slate-800 dark:bg-slate-900">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-gray-500 py-8 dark:text-gray-400"
              >
                Loading...
              </TableCell>
            </TableRow>
          )}
          {!loading && error && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-red-500 py-8 dark:text-red-400"
              >
                {errorMessage}
              </TableCell>
            </TableRow>
          )}
          {!loading && !error && rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="text-center text-gray-500 py-8 dark:text-gray-400"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
          {!loading &&
            !error &&
            rows.map((row) => (
              <TableRow
                key={getRowKey(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? 'cursor-pointer' : undefined}
              >
                {columns.map((column) => (
                  <TableCell key={column.key} className={column.className}>
                    {column.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  )
}
