import { ObjectId } from 'mongoose'

export interface IUser {
  _id?: ObjectId
  username: string
  password: string
  deletedAt?: Date
}
