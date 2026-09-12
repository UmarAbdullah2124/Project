  'use client'

import { useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CalendarDays } from 'lucide-react'
import { useSession } from 'next-auth/react'

import { ProjectFormDialog } from '@/components/custom/project-form-dialog'

const GET_PROJECTS = gql`
  query GetProjects {
    projects {
      id
      title
      status
      dueDate
      client {
        id
        name
      }
    }
  }
`

const UPDATE_PROJECT_STATUS = gql`
  mutation UpdateProjectStatus($id: ID!, $status: ProjectStatus!) {
    updateProjectStatus(id: $id, status: $status) {
      id
      status
    }
  }
`

type Project = {
  id: string
  title: string
  status: string
  dueDate: string | null
  client: { id: string; name: string }
}

type Status = 'NOT_STARTED' | 'IN_PROGRESS' | 'REVIEW' | 'DONE'

const COLUMNS: { status: Status; label: string }[] = [
  { status: 'NOT_STARTED', label: 'Not Started' },
  { status: 'IN_PROGRESS', label: 'In Progress' },
  { status: 'REVIEW', label: 'Review' },
  { status: 'DONE', label: 'Done' },
]

const emptyColumns: Record<Status, Project[]> = {
  NOT_STARTED: [],
  IN_PROGRESS: [],
  REVIEW: [],
  DONE: [],
}

function formatDueDate(value: string) {
  const timestamp = Number(value)
  if (Number.isNaN(timestamp)) return value
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

function findContainer(
  id: string,
  columns: Record<Status, Project[]>
): Status | undefined {
  if (id in columns) return id as Status
  return (Object.keys(columns) as Status[]).find((status) =>
    columns[status].some((project) => project.id === id)
  )
}

function ProjectCard({ project, disabled }: { project: Project; disabled: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: project.id, disabled })

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
      className={`space-y-1.5 rounded-lg border bg-white p-3 shadow-sm ${
        disabled ? '' : 'cursor-grab active:cursor-grabbing'
      }`}
    >
      <div className="text-sm font-medium text-gray-900">{project.title}</div>
      <div className="text-xs text-gray-500">{project.client.name}</div>
      {project.dueDate && (
        <div className="flex items-center gap-1 text-xs text-gray-400">
          <CalendarDays size={12} />
          {formatDueDate(project.dueDate)}
        </div>
      )}
    </div>
  )
}

function Column({
  status,
  label,
  projects,
  disabled,
}: {
  status: Status
  label: string
  projects: Project[]
  disabled: boolean
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status })

  return (
    <div className="flex w-72 shrink-0 flex-col rounded-lg bg-gray-100 p-3">
      <div className="mb-3 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
        <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-500">
          {projects.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`min-h-[120px] flex-1 space-y-2 rounded-md p-1 transition-colors ${
          isOver ? 'bg-indigo-50' : ''
        }`}
      >
        <SortableContext
          items={projects.map((p) => p.id)}
          strategy={verticalListSortingStrategy}
        >
          {projects.length === 0 ? (
            <div className="rounded-md border border-dashed border-gray-300 p-4 text-center text-xs text-gray-400">
              No projects
            </div>
          ) : (
            projects.map((project) => (
              <ProjectCard key={project.id} project={project} disabled={disabled} />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  )
}

export default function ProjectsPage() {
  const { data: sessionData } = useSession()
  const isViewer = sessionData?.user?.role === 'VIEWER'
  const { data, loading, error } = useQuery<{ projects: Project[] }>(GET_PROJECTS)
  const [updateProjectStatus] = useMutation(UPDATE_PROJECT_STATUS, {
    refetchQueries: ['GetProjects'],
  })
  const [columns, setColumns] = useState<Record<Status, Project[]>>(emptyColumns)

  useEffect(() => {
    if (!data?.projects) return
    const grouped: Record<Status, Project[]> = {
      NOT_STARTED: [],
      IN_PROGRESS: [],
      REVIEW: [],
      DONE: [],
    }
    for (const project of data.projects) {
      const status = project.status as Status
      if (grouped[status]) grouped[status].push(project)
    }
    setColumns(grouped)
  }, [data])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    if (isViewer) return
    const { active, over } = event
    if (!over) return

    const activeId = String(active.id)
    const sourceStatus = findContainer(activeId, columns)
    const destStatus = findContainer(String(over.id), columns)

    if (!sourceStatus || !destStatus || sourceStatus === destStatus) return

    const project = columns[sourceStatus].find((p) => p.id === activeId)
    if (!project) return

    setColumns((prev) => ({
      ...prev,
      [sourceStatus]: prev[sourceStatus].filter((p) => p.id !== activeId),
      [destStatus]: [...prev[destStatus], { ...project, status: destStatus }],
    }))

    updateProjectStatus({ variables: { id: activeId, status: destStatus } })
  }

  const totalProjects = data?.projects?.length ?? 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-gray-500">{totalProjects} total projects</p>
        </div>
        <ProjectFormDialog />
      </div>

      {loading && (
        <div className="rounded-lg border bg-white p-6 text-center text-sm text-gray-500">
          Loading...
        </div>
      )}

      {error && (
        <div className="rounded-lg border bg-white p-6 text-center text-sm text-red-500">
          Failed to load projects.
        </div>
      )}

      {!loading && !error && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-2">
            {COLUMNS.map((column) => (
              <Column
                key={column.status}
                status={column.status}
                label={column.label}
                projects={columns[column.status]}
                disabled={isViewer}
              />
            ))}
          </div>
        </DndContext>
      )}
    </div>
  )
}
