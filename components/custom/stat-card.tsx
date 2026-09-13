export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{value}</div>
    </div>
  )
}
