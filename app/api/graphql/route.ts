import { ApolloServer } from '@apollo/server'
import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { NextRequest } from 'next/server'
import { auth } from '@/auth'
import { typeDefs } from '@/lib/graphql/schema'
import { resolvers } from '@/lib/graphql/resolvers'
import type { GraphQLContext } from '@/lib/graphql/context'

const server = new ApolloServer<GraphQLContext>({ typeDefs, resolvers })

const handler = startServerAndCreateNextHandler(server, {
  context: async () => ({ session: await auth() }),
})

export async function GET(request: NextRequest) {
  return handler(request)
}

export async function POST(request: NextRequest) {
  return handler(request)
}
