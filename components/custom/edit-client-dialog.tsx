'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
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

const UPDATE_CLIENT = gql`
  mutation UpdateClient($id: ID!, $input: UpdateClientInput!) {
    updateClient(id: $id, input: $input) {
      id
      name
      industry
      contactEmail
      contactPhone
      status
      mrr
    }
  }
`

const clientFormSchema = z.object({
  name: z.string().min(1, 'Client name is required'),
  industry: z.string().optional(),
  contactEmail: z
    .string()
    .email('Enter a valid email')
    .optional()
    .or(z.literal('')),
  contactPhone: z.string().optional(),
  status: z.enum(['active', 'onboarding', 'inactive']),
  mrr: z.coerce.number().min(0, 'MRR must be positive').optional(),
})

type ClientFormInput = z.input<typeof clientFormSchema>
type ClientFormOutput = z.output<typeof clientFormSchema>

export type EditableClient = {
  id: string
  name: string
  industry: string | null
  contactEmail: string | null
  contactPhone: string | null
  status: string
  mrr: number
}

function toFormValues(client: EditableClient): ClientFormInput {
  return {
    name: client.name,
    industry: client.industry ?? '',
    contactEmail: client.contactEmail ?? '',
    contactPhone: client.contactPhone ?? '',
    status: (client.status as ClientFormInput['status']) ?? 'onboarding',
    mrr: client.mrr,
  }
}

export function EditClientDialog({
  client,
  open,
  onOpenChange,
}: {
  client: EditableClient
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormInput, unknown, ClientFormOutput>({
    resolver: zodResolver(clientFormSchema),
    defaultValues: toFormValues(client),
  })

  useEffect(() => {
    if (open) reset(toFormValues(client))
  }, [open, client, reset])

  const [updateClient] = useMutation(UPDATE_CLIENT, {
    refetchQueries: ['GetClient', 'GetClients'],
    awaitRefetchQueries: true,
  })

  const onSubmit = async (values: ClientFormOutput) => {
    await updateClient({
      variables: {
        id: client.id,
        input: {
          name: values.name,
          industry: values.industry || null,
          contactEmail: values.contactEmail || null,
          contactPhone: values.contactPhone || null,
          status: values.status,
          mrr: values.mrr ?? 0,
        },
      },
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Client</DialogTitle>
          <DialogDescription>Update this client&apos;s details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="edit-name">Client Name</FieldLabel>
              <Input id="edit-name" placeholder="Acme Corp" {...register('name')} />
              <FieldError errors={errors.name ? [errors.name] : undefined} />
            </Field>

            <Field data-invalid={!!errors.industry}>
              <FieldLabel htmlFor="edit-industry">Industry</FieldLabel>
              <Input id="edit-industry" placeholder="Software" {...register('industry')} />
              <FieldError errors={errors.industry ? [errors.industry] : undefined} />
            </Field>

            <Field data-invalid={!!errors.contactEmail}>
              <FieldLabel htmlFor="edit-contactEmail">Contact Email</FieldLabel>
              <Input
                id="edit-contactEmail"
                type="email"
                placeholder="jane@acme.com"
                {...register('contactEmail')}
              />
              <FieldError errors={errors.contactEmail ? [errors.contactEmail] : undefined} />
            </Field>

            <Field data-invalid={!!errors.contactPhone}>
              <FieldLabel htmlFor="edit-contactPhone">Contact Phone</FieldLabel>
              <Input
                id="edit-contactPhone"
                placeholder="+1 555 123 4567"
                {...register('contactPhone')}
              />
              <FieldError errors={errors.contactPhone ? [errors.contactPhone] : undefined} />
            </Field>

            <Field data-invalid={!!errors.status}>
              <FieldLabel htmlFor="edit-status">Status</FieldLabel>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="edit-status" className="w-full">
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="onboarding">Onboarding</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              <FieldError errors={errors.status ? [errors.status] : undefined} />
            </Field>

            <Field data-invalid={!!errors.mrr}>
              <FieldLabel htmlFor="edit-mrr">MRR</FieldLabel>
              <Input
                id="edit-mrr"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('mrr')}
              />
              <FieldError errors={errors.mrr ? [errors.mrr] : undefined} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
