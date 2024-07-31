import { Model, model, Schema } from 'mongoose'
import { IRole } from '../../interfaces'

type RoleModel = Model<IRole>
const roleSchema: Schema<IRole, RoleModel> = new Schema<IRole, RoleModel>(
  {
    role: {
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

export const Role: RoleModel = model<IRole, RoleModel>('roles', roleSchema)
