'use client'

import { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { gql } from '@apollo/client'
import { useMutation, useQuery } from '@apollo/client/react'
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

const GET_CLIENTS_FOR_SELECT = gql`
  query GetClientsForSelect {
    clients {
      id
      name
    }
  }
`

const CREATE_INVOICE = gql`
  mutation CreateInvoice($input: CreateInvoiceInput!) {
    createInvoice(input: $input) {
      id
      amount
      status
      issuedDate
      dueDate
      client {
        id
        name
      }
    }
  }
`

const invoiceStatusOptions = [
  { value: 'PENDING', label: 'Pending' },
  { value: 'PAID', label: 'Paid' },
  { value: 'OVERDUE', label: 'Overdue' },
] as const

const invoiceFormSchema = z.object({
  clientId: z.string().min(1, 'Please select a client'),
  amount: z.coerce.number().positive('Amount must be greater than 0'),
  status: z.enum(['PENDING', 'PAID', 'OVERDUE']),
  dueDate: z.string().min(1, 'Due date is required'),
})

type InvoiceFormInput = z.input<typeof invoiceFormSchema>
type InvoiceFormOutput = z.output<typeof invoiceFormSchema>

const defaultValues: InvoiceFormInput = {
  clientId: '',
  amount: undefined,
  status: 'PENDING',
  dueDate: '',
}

export function InvoiceFormDialog() {
  const { data: session } = useSession()
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
  } = useForm<InvoiceFormInput, unknown, InvoiceFormOutput>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues,
  })

  const [createInvoice] = useMutation(CREATE_INVOICE, {
    refetchQueries: ['GetInvoices'],
    awaitRefetchQueries: true,
  })

  const onSubmit = async (values: InvoiceFormOutput) => {
    await createInvoice({
      variables: {
        input: {
          clientId: values.clientId,
          amount: values.amount,
          status: values.status,
          dueDate: values.dueDate,
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
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus size={16} className="mr-2" />
            New Invoice
          </Button>
        }
      />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Invoice</DialogTitle>
          <DialogDescription>
            Create a new invoice for a client.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
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

            <Field data-invalid={!!errors.amount}>
              <FieldLabel htmlFor="amount">Amount</FieldLabel>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register('amount')}
              />
              <FieldError errors={errors.amount ? [errors.amount] : undefined} />
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
                      {invoiceStatusOptions.map((option) => (
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
              {isSubmitting ? 'Creating...' : 'Create Invoice'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
