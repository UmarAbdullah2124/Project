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

  enum ProjectStatus {
    NOT_STARTED
    IN_PROGRESS
    REVIEW
    DONE
  }

  type Project {
    id: ID!
    title: String!
    status: String!
    dueDate: String
    client: Client!
    owner: User!
    createdAt: String!
  }

  enum InvoiceStatus {
    PENDING
    PAID
    OVERDUE
  }

  type Invoice {
    id: ID!
    amount: Float!
    status: String!
    issuedDate: String!
    dueDate: String!
    client: Client!
  }

  type Query {
    clients: [Client!]!
    client(id: ID!): Client
    projects: [Project!]!
    invoices: [Invoice!]!
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

  input CreateProjectInput {
    title: String!
    clientId: ID!
    ownerId: ID
    status: ProjectStatus
    dueDate: String
  }

  input CreateInvoiceInput {
    clientId: ID!
    amount: Float!
    status: InvoiceStatus
    dueDate: String!
  }

  type Mutation {
    createClient(input: CreateClientInput!): Client!
    createProject(input: CreateProjectInput!): Project!
    updateProjectStatus(id: ID!, status: ProjectStatus!): Project!
    createInvoice(input: CreateInvoiceInput!): Invoice!
  }
`