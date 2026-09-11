import { prisma } from '@/lib/prisma'

export const resolvers = {
  Query: {
    clients: () => prisma.client.findMany({ orderBy: { createdAt: 'desc' } }),
    client: (_parent: unknown, { id }: { id: string }) =>
      prisma.client.findUnique({ where: { id } }),
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
  Mutation: {
    createClient: (_parent: unknown, { input }: { input: any }) =>
      prisma.client.create({ data: input }),
  },
}