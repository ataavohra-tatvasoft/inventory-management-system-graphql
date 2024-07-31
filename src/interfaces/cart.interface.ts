import { ObjectId } from 'mongoose'

export interface ICartItem {
  productId: ObjectId
  attributeId: ObjectId
  optionId: ObjectId
  quantity: number
}

export interface ICart {
  _id?: ObjectId
  userId: ObjectId
  items: ICartItem[]
  deletedAt?: Date
}
