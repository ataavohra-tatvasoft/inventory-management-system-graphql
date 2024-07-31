import { Model, model, Schema } from 'mongoose'
import { IUser } from '../../interfaces'

type UserModel = Model<IUser>
const userSchema: Schema<IUser, UserModel> = new Schema<IUser, UserModel>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      allownull: false,
      minlength: 5
    },
    password: {
      type: String,
      required: true
    },
    deletedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

export const User: UserModel = model<IUser, UserModel>('users', userSchema)
