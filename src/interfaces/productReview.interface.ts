import { ObjectId } from 'mongoose'

export interface IProductReview {
  _id?: ObjectId
  productId: ObjectId
  userId: ObjectId
  review: string
  deletedAt?: Date
}
