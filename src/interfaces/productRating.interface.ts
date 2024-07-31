import { ObjectId } from 'mongoose'

export interface IProductRating {
  _id?: ObjectId
  productId: ObjectId
  userId: ObjectId
  rating: number
  deletedAt?: Date
}
