import { gql } from 'apollo-server-express'

const userSchema = gql`
  input UserInputData {
    username: String
    password: String
  }

  input PaginationInput {
    page: Int
    pageSize: Int
  }

  type Pagination {
    page: Int!
    pageSize: Int!
    totalPages: Int!
  }

  type User {
    id: ID!
    username: String!
  }

  type UserListResponse {
    statusCode: String!
    message: String!
    activeUsers: [User!]
    pagination: Pagination!
  }

  type Response {
    statusCode: String!
    message: String!
    id: ID
    username: String
  }

  type Query {
    users(pagination: PaginationInput): UserListResponse
    user(id: ID!): User
  }

  type Mutation {
    createUser(userInput: UserInputData): Response
    deactivateUser(userId: ID!): Response
    deleteUserPermanently(userId: ID!): Response
  }
`

export default { userSchema }
