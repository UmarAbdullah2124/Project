'use client'

import { memo, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { gql } from '@apollo/client'
import { useMutation } from '@apollo/client/react'
import { useSession } from 'next-auth/react'
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

const CREATE_CLIENT = gql`
  mutation CreateClient($input: CreateClientInput!) {
    createClient(input: $input) {
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

const defaultValues: ClientFormInput = {
  name: '',
  industry: '',
  contactEmail: '',
  contactPhone: '',
  status: 'onboarding',
  mrr: undefined,
}

function ClientFormDialogImpl() {
  const { data: session } = useSession()
  const [open, setOpen] = useState(false)

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClientFormInput, unknown, ClientFormOutput>({
    resolver: zodResolver(clientFormSchema),
    defaultValues,
  })

  const [createClient] = useMutation(CREATE_CLIENT, {
    refetchQueries: ['GetClients'],
    awaitRefetchQueries: true,
  })

  const onSubmit = async (values: ClientFormOutput) => {
    await createClient({
      variables: {
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
    reset(defaultValues)
    setOpen(false)
  }

  if (session?.user?.role === 'VIEWER') return null

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
          <Button className="bg-indigo-600 text-white hover:bg-indigo-700">
            <Plus size={16} className="mr-2" />
            Add Client
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Client</DialogTitle>
          <DialogDescription>
            Create a new client record. You can fill in the rest of the details later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Client Name</FieldLabel>
              <Input id="name" placeholder="Acme Corp" {...register('name')} />
              <FieldError errors={errors.name ? [errors.name] : undefined} />
            </Field>

            <Field data-invalid={!!errors.industry}>
              <FieldLabel htmlFor="industry">Industry</FieldLabel>
              <Input id="industry" placeholder="Software" {...register('industry')} />
              <FieldError errors={errors.industry ? [errors.industry] : undefined} />
            </Field>

            <Field data-invalid={!!errors.contactEmail}>
              <FieldLabel htmlFor="contactEmail">Contact Email</FieldLabel>
              <Input
                id="contactEmail"
                type="email"
                placeholder="jane@acme.com"
                {...register('contactEmail')}
              />
              <FieldError errors={errors.contactEmail ? [errors.contactEmail] : undefined} />
            </Field>

            <Field data-invalid={!!errors.contactPhone}>
              <FieldLabel htmlFor="contactPhone">Contact Phone</FieldLabel>
              <Input id="contactPhone" placeholder="+1 555 123 4567" {...register('contactPhone')} />
              <FieldError errors={errors.contactPhone ? [errors.contactPhone] : undefined} />
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
              <FieldLabel htmlFor="mrr">MRR</FieldLabel>
              <Input
                id="mrr"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('mrr')}
              />
              <FieldError errors={errors.mrr ? [errors.mrr] : undefined} />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-indigo-600 text-white hover:bg-indigo-700"
            >
              {isSubmitting ? 'Saving...' : 'Save Client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export const ClientFormDialog = memo(ClientFormDialogImpl)
