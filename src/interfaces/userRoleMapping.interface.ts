import { ObjectId } from 'mongoose'

interface IUserId {
  _id: ObjectId
  email?: string
  firstname?: string
  lastname?: string
}

interface IRoleId {
  _id: ObjectId
  role?: string
}

export interface IUserRoleMapping {
  _id?: ObjectId
  userId?: IUserId
  roleId?: IRoleId
  deletedAt?: Date
}
