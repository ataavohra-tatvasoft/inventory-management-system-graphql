import { ObjectId } from 'mongoose'

export interface IAttributeOption {
  _id?: ObjectId
  value: string
  stock: number
  deletedAt?: Date
}

export interface IProductAttribute {
  _id?: ObjectId
  name: string
  options: IAttributeOption[]
  deletedAt?: Date
}

export interface IProduct {
  _id?: ObjectId
  productId: string
  name: string
  description: string
  price: number
  category: string
  attributes: IProductAttribute[]
  deletedAt?: Date
}
