import { ObjectId } from 'mongoose'

export interface IProductImage {
  _id?: ObjectId
  productId: object
  imagePath: string
  imageName: string
  deletedAt?: Date
}
