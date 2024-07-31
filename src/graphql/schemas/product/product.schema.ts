import { gql } from 'apollo-server-express'

const productSchema = gql`
  scalar Upload

  type ProductImage {
    id: ID!
    productId: ID!
    imageName: String!
    imagePath: String!
  }

  input PaginationInput {
    page: Int
    pageSize: Int
  }

  input OptionInput {
    value: String!
    stock: Int!
  }

  input AttributeInput {
    name: String!
    options: [OptionInput!]!
  }

  input ProductInputData {
    name: String!
    description: String!
    price: Float!
    category: String!
    attributes: [AttributeInput!]!
  }

  type AttributeOption {
    value: String!
    stock: Int!
  }

  type Attribute {
    name: String!
    options: [AttributeOption!]!
  }

  type Product {
    id: ID!
    productId: String!
    name: String!
    description: String!
    price: Float!
    category: String!
    attributes: [Attribute!]!
  }

  type ProductListResponse {
    statusCode: String!
    message: String!
    products: [Product!]
    pagination: Pagination
  }

  type Reviews {
    id: ID!
    userId: User!
    productId: Product!
    review: String!
    createdAt: String
    deletedAt: String
  }

  type RatingSummary {
    averageRating: Float!
    totalRatings: Int!
  }

  type Response {
    statusCode: String!
    message: String!
    id: ID
  }

  type Query {
    products(pagination: PaginationInput): ProductListResponse
    product(id: ID!): Product
    reviewsSummary(productId: ID!, page: Int, pageSize: Int): [Reviews!]
    ratingsSummary(productId: ID!): RatingSummary
  }

  type Mutation {
    addProduct(productInput: ProductInputData): Response
    addProductAttribute(productId: ID!, name: String!, options: [OptionInput!]!): Response
    addProductOptions(productId: ID!, attributeId: ID!, options: [OptionInput!]!): Response
    removeProductAttribute(productId: ID!, attributeId: ID!): Response
    removeProductOptions(productId: ID!, attributeId: ID!, optionIds: [ID!]!): Response
    deactivateProduct(productId: ID!): Response
    deleteProductPermanently(productId: ID!): Response
  }
`

export default { productSchema }
