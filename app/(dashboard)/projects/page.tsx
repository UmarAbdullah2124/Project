'use client'

import { useEffect, useState } from 'react'
import { gql } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'
import { useSession } from 'next-auth/react'

import { ProjectFormDialog } from '@/components/custom/project-form-dialog'
import { KanbanBoard, emptyColumns, type Project, type Status } from '@/components/custom/kanban-board'

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

  const handleDragEnd = (sourceStatus: Status, destStatus: Status, projectId: string) => {
    const project = columns[sourceStatus].find((p) => p.id === projectId)
    if (!project) return

    setColumns((prev) => ({
      ...prev,
      [sourceStatus]: prev[sourceStatus].filter((p) => p.id !== projectId),
      [destStatus]: [...prev[destStatus], { ...project, status: destStatus }],
    }))

    updateProjectStatus({ variables: { id: projectId, status: destStatus } })
  }

  const totalProjects = data?.projects?.length ?? 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{totalProjects} total projects</p>
        </div>
        <ProjectFormDialog />
      </div>

      {loading && (
        <div className="rounded-lg border bg-white p-6 text-center text-sm text-gray-500 dark:border-slate-800 dark:bg-slate-900 dark:text-gray-400">
          Loading...
        </div>
      )}

      {error && (
        <div className="rounded-lg border bg-white p-6 text-center text-sm text-red-500 dark:border-slate-800 dark:bg-slate-900 dark:text-red-400">
          Failed to load projects.
        </div>
      )}

      {!loading && !error && (
        <KanbanBoard columns={columns} disabled={isViewer} onDragEnd={handleDragEnd} />
      )}
    </div>
  )
}
