'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CalendarDays } from 'lucide-react'

export type ProjectCardData = {
  id: string
  title: string
  dueDate: string | null
  client: { id: string; name: string }
}

function formatDueDate(value: string) {
  const timestamp = Number(value)
  if (Number.isNaN(timestamp)) return value
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function ProjectCard({
  project,
  disabled = false,
}: {
  project: ProjectCardData
  disabled?: boolean
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: project.id,
    disabled,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`space-y-1.5 rounded-lg border bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-800 ${
        disabled ? '' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{project.title}</div>
      <div className="text-xs text-gray-500 dark:text-gray-400">{project.client.name}</div>
      {project.dueDate && (
        <div className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
          <CalendarDays size={12} />
          {formatDueDate(project.dueDate)}
        </div>
      )}
    </div>
  )
}
