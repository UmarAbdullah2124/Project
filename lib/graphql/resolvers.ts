import { GraphQLError } from 'graphql'
import { prisma } from '@/lib/prisma'
import type { GraphQLContext } from '@/lib/graphql/context'

function requireEditor(context: GraphQLContext) {
  if (!context.session?.user) {
    throw new GraphQLError('Not authenticated', {
      extensions: { code: 'UNAUTHENTICATED' },
    })
  }
  if (context.session.user.role === 'VIEWER') {
    throw new GraphQLError('Viewers cannot perform this action', {
      extensions: { code: 'FORBIDDEN' },
    })
  }
}

export const resolvers = {
  Query: {
    clients: () => prisma.client.findMany({ orderBy: { createdAt: 'desc' } }),
    client: (_parent: unknown, { id }: { id: string }) =>
      prisma.client.findUnique({ where: { id } }),
    projects: () => prisma.project.findMany({ orderBy: { createdAt: 'desc' } }),
    invoices: () => prisma.invoice.findMany({ orderBy: { issuedDate: 'desc' } }),
  },
  Client: {
    accountManager: (parent: { accountManagerId: string | null }) =>
      parent.accountManagerId
        ? prisma.user.findUnique({ where: { id: parent.accountManagerId } })
        : null,
    projects: (parent: { id: string }) =>
      prisma.project.findMany({ where: { clientId: parent.id } }),
    invoices: (parent: { id: string }) =>
      prisma.invoice.findMany({ where: { clientId: parent.id } }),
  },
  Project: {
    client: (parent: { clientId: string }) =>
      prisma.client.findUnique({ where: { id: parent.clientId } }),
    owner: (parent: { ownerId: string }) =>
      prisma.user.findUnique({ where: { id: parent.ownerId } }),
  },
  Invoice: {
    client: (parent: { clientId: string }) =>
      prisma.client.findUnique({ where: { id: parent.clientId } }),
  },
  Mutation: {
    createClient: (_parent: unknown, { input }: { input: any }, context: GraphQLContext) => {
      requireEditor(context)
      return prisma.client.create({ data: input })
    },
    createProject: async (
      _parent: unknown,
      { input }: { input: any },
      context: GraphQLContext
    ) => {
      requireEditor(context)
      const ownerId = input.ownerId ?? context.session!.user.id
      return prisma.project.create({
        data: {
          title: input.title,
          clientId: input.clientId,
          ownerId,
          status: input.status ?? 'NOT_STARTED',
          dueDate: input.dueDate ? new Date(input.dueDate) : null,
        },
      })
    },
    updateProjectStatus: (
      _parent: unknown,
      { id, status }: { id: string; status: any },
      context: GraphQLContext
    ) => {
      requireEditor(context)
      return prisma.project.update({ where: { id }, data: { status } })
    },
    createInvoice: (_parent: unknown, { input }: { input: any }, context: GraphQLContext) => {
      requireEditor(context)
      return prisma.invoice.create({
        data: {
          clientId: input.clientId,
          amount: input.amount,
          status: input.status ?? 'PENDING',
          dueDate: new Date(input.dueDate),
        },
      })
    },
  },
}