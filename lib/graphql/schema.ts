import gql from 'graphql-tag'

export const typeDefs = gql`
  type Client {
    id: ID!
    name: String!
    industry: String
    contactEmail: String
    contactPhone: String
    status: String!
    mrr: Float!
    accountManager: User
    projects: [Project!]!
    invoices: [Invoice!]!
    createdAt: String!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    role: String!
  }

  type Project {
    id: ID!
    title: String!
    status: String!
  }

  type Invoice {
    id: ID!
    amount: Float!
    status: String!
    dueDate: String!
  }

  type Query {
    clients: [Client!]!
    client(id: ID!): Client
  }

  input CreateClientInput {
    name: String!
    industry: String
    contactEmail: String
    contactPhone: String
    status: String
    mrr: Float
    accountManagerId: ID
  }

  type Mutation {
    createClient(input: CreateClientInput!): Client!
  }
`