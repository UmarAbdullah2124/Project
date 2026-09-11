'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { gql } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'
import { Plus } from 'lucide-react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Field, FieldLabel, FieldError, FieldGroup } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'

const GET_CLIENTS_FOR_SELECT = gql`
  query GetClientsForSelect {
    clients {
      id
      name
    }
  }
`

const CREATE_PROJECT = gql`
  mutation CreateProject($input: CreateProjectInput!) {
    createProject(input: $input) {
      id
      title
      status
      dueDate
      client {
        id
        name
      }
      owner {
        id
        name
      }
      createdAt
    }
  }
`

const projectStatusOptions = [
  { value: 'NOT_STARTED', label: 'Not Started' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'REVIEW', label: 'Review' },
  { value: 'DONE', label: 'Done' },
] as const

const projectFormSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  clientId: z.string().min(1, 'Please select a client'),
  status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'REVIEW', 'DONE']),
  dueDate: z.string().optional(),
})

type ProjectFormValues = z.infer<typeof projectFormSchema>

const defaultValues: ProjectFormValues = {
  title: '',
  clientId: '',
  status: 'NOT_STARTED',
  dueDate: '',
}

export function ProjectFormDialog() {
  const [open, setOpen] = useState(false)

  const { data: clientsData } = useQuery<{ clients: { id: string; name: string }[] }>(
    GET_CLIENTS_FOR_SELECT
  )

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues,
  })

  const [createProject] = useMutation(CREATE_PROJECT, {
    refetchQueries: ['GetProjects'],
    awaitRefetchQueries: true,
  })

  const onSubmit = async (values: ProjectFormValues) => {
    await createProject({
      variables: {
        input: {
          title: values.title,
          clientId: values.clientId,
          status: values.status,
          dueDate: values.dueDate || null,
        },
      },
    })
    reset(defaultValues)
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) reset(defaultValues)
      }}
    >
      <DialogTrigger
        render={
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus size={16} className="mr-2" />
            New Project
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Project</DialogTitle>
          <DialogDescription>
            Create a new project and assign it to a client.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.title}>
              <FieldLabel htmlFor="title">Project Title</FieldLabel>
              <Input id="title" placeholder="Website Redesign" {...register('title')} />
              <FieldError errors={errors.title ? [errors.title] : undefined} />
            </Field>

            <Field data-invalid={!!errors.clientId}>
              <FieldLabel htmlFor="clientId">Client</FieldLabel>
              <Controller
                name="clientId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="clientId" className="w-full">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      {clientsData?.clients?.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={errors.clientId ? [errors.clientId] : undefined} />
            </Field>

            <Field data-invalid={!!errors.status}>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="status" className="w-full">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectStatusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={errors.status ? [errors.status] : undefined} />
            </Field>

            <Field data-invalid={!!errors.dueDate}>
              <FieldLabel htmlFor="dueDate">Due Date</FieldLabel>
              <Input id="dueDate" type="date" {...register('dueDate')} />
              <FieldError errors={errors.dueDate ? [errors.dueDate] : undefined} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
