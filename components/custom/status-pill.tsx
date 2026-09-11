const statusStyles: Record<string, { pill: string; dot: string }> = {
  active: { pill: 'bg-green-50 text-green-700', dot: 'bg-green-500' },
  onboarding: { pill: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  trial: { pill: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  inactive: { pill: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' },
  pending: { pill: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  paid: { pill: 'bg-green-50 text-green-700', dot: 'bg-green-500' },
  overdue: { pill: 'bg-red-50 text-red-700', dot: 'bg-red-500' },
}

export function StatusPill({ status }: { status: string }) {
  const style = statusStyles[status.toLowerCase()] ?? statusStyles.inactive
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${style.pill}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  )
}
