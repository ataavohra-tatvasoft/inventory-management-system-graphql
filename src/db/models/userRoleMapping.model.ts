import { Model, model, Schema } from 'mongoose'
import { IUserRoleMapping } from '../../interfaces'

type UserRoleMappingModel = Model<IUserRoleMapping>
const userRoleMappingSchema: Schema<IUserRoleMapping, UserRoleMappingModel> = new Schema<
  IUserRoleMapping,
  UserRoleMappingModel
>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true
    },
    roleId: {
      type: Schema.Types.ObjectId,
      ref: 'roles',
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

export const UserRoleMapping: UserRoleMappingModel = model<IUserRoleMapping, UserRoleMappingModel>(
  'userRoleMappings',
  userRoleMappingSchema
)
