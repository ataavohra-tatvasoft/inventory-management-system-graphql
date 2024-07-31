import bcrypt from 'bcrypt'
import { envConfig } from '../../../configs'
import { User } from '../../../db/models'
import { HttpError } from '../../../libs'
import { httpErrorMessageConstant, httpStatusConstant, messageConstant } from '../../../constants'
import { UserInput, PaginationInput } from '../../types'

const userResolver = {
  Query: {
    users: async (_: any, { pagination }: { pagination: PaginationInput }) => {
      const { page = 1, pageSize = 10 } = pagination
      const skip = (Number(page) - 1) * Number(pageSize)

      const totalUsersCount = await User.countDocuments({ deletedAt: null })
      if (!totalUsersCount) {
        throw new HttpError(messageConstant.NO_ACTIVE_USERS_FOUND, httpStatusConstant.BAD_REQUEST)
      }

      const totalPages = Math.ceil(totalUsersCount / Number(pageSize))

      if (Number(page) > Number(totalPages)) {
        throw new HttpError(messageConstant.INVALID_PAGE_NUMBER, httpStatusConstant.BAD_REQUEST)
      }

      const activeUsers = await User.find(
        { deletedAt: null },
        {
          _id: 1,
          username: 1
        }
      )
        .skip(skip)
        .limit(Number(pageSize))

      if (!activeUsers?.length) {
        throw new HttpError(messageConstant.NO_ACTIVE_USERS_FOUND, httpStatusConstant.BAD_REQUEST)
      }

      return {
        statusCode: httpStatusConstant.OK,
        message: httpErrorMessageConstant.SUCCESSFUL,
        activeUsers,
        pagination: {
          page: page,
          pageSize: pageSize,
          totalPages
        }
      }
    },
    user: async (_: any, { id }: { id: string }) => {
      return await User.findById(id)
    }
  },
  Mutation: {
    createUser: async (_: any, { userInput }: { userInput: UserInput }) => {
      const salt = await bcrypt.genSalt(Number(envConfig.saltRounds))
      const hashedPassword = userInput.password
        ? await bcrypt.hash(String(userInput.password), salt)
        : undefined

      const newUser = await User.create({
        username: userInput.username,
        password: hashedPassword,
        deletedAt: null
      })

      if (!newUser) {
        throw new HttpError(
          messageConstant.ERROR_CREATING_USER,
          httpStatusConstant.INTERNAL_SERVER_ERROR
        )
      }

      return {
        statusCode: httpStatusConstant.OK,
        message: httpErrorMessageConstant.SUCCESSFUL,
        id: newUser._id,
        username: newUser.username
      }
    },
    deactivateUser: async (_: any, { userId }: { userId: string }) => {
      const user = await User.findOne({ _id: userId, deletedAt: null })
      if (!user) {
        throw new HttpError(messageConstant.USER_NOT_FOUND, httpStatusConstant.BAD_REQUEST)
      }

      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { deletedAt: Date.now() } },
        { new: true }
      )

      if (!updatedUser) {
        throw new HttpError(
          messageConstant.ERROR_DELETING_USER,
          httpStatusConstant.INTERNAL_SERVER_ERROR
        )
      }

      return {
        statusCode: httpStatusConstant.OK,
        message: messageConstant.USER_DELETED_SOFT
      }
    },
    deleteUserPermanently: async (_: any, { userId }: { userId: string }) => {
      const user = await User.findById({ _id: userId })
      if (!user) {
        throw new HttpError(messageConstant.USER_NOT_FOUND, httpStatusConstant.BAD_REQUEST)
      }

      const deletedUser = await User.deleteOne({ _id: userId })
      if (!deletedUser) {
        throw new HttpError(
          messageConstant.ERROR_DELETING_USER,
          httpStatusConstant.INTERNAL_SERVER_ERROR
        )
      }

      return {
        statusCode: httpStatusConstant.OK,
        message: messageConstant.USER_DELETED_HARD
      }
    }
  }
}

export default { userResolver }
