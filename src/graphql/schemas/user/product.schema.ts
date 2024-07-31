import { gql } from 'apollo-server-express'

const productSchema = gql`
  input ReviewInputData {
    productId: ID!
    userId: ID!
    review: String!
  }

  input RatingInputData {
    productId: ID!
    userId: ID!
    rating: Int!
  }

  type Review {
    id: ID!
    productId: ID!
    userId: ID!
    review: String!
    createdAt: String
    deletedAt: String
  }

  type Rating {
    id: ID!
    productId: ID!
    userId: ID!
    rating: Int!
    createdAt: String
    deletedAt: String
  }

  type ReviewResponse {
    statusCode: String!
    message: String!
    data: Review
  }

  type RatingResponse {
    statusCode: String!
    message: String!
    data: Rating
  }

  type Mutation {
    addReview(reviewInput: ReviewInputData!): ReviewResponse
    addRating(ratingInput: RatingInputData!): RatingResponse
    deleteReviewPermanently(reviewId: ID!): ReviewResponse
    deleteRatingPermanently(ratingId: ID!): RatingResponse
  }
`

export default { productSchema }
