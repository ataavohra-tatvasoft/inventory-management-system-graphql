import { Request, Response } from 'express'
import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { User } from '../../db/models'
import { Controller } from '../../types'
import { httpStatusConstant, httpErrorMessageConstant, messageConstant } from '../../constants'
import { responseHandlerUtils } from '../../utils'
import { envConfig } from '../../configs'
import { HttpError } from '../../libs'
import { ICustomQuery } from '../../interfaces'

/**
 * @description Registers a new user.
 */
const addUser: Controller = async (req: Request, res: Response) => {
  const { username, password } = req.body

  const salt = await bcrypt.genSalt(Number(envConfig.saltRounds))
  const hashedPassword = password ? await bcrypt.hash(password, salt) : undefined

  const newUser = await User.create({
    username,
    password: hashedPassword,
    deletedAt: null
  })

  if (!newUser) {
    throw new HttpError(
      messageConstant.ERROR_CREATING_USER,
      httpStatusConstant.INTERNAL_SERVER_ERROR
    )
  }

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: httpErrorMessageConstant.SUCCESSFUL
  })
}

/**
 * @description Retrieves a list of active users with essential details.
 */
const getActiveUsersList: Controller = async (req: Request, res: Response) => {
  const { page = 1, pageSize = 10 } = req.query as unknown as ICustomQuery
  const skip = (page - 1) * pageSize

  const totalUsersCount = await User.countDocuments({ deletedAt: null })
  if (!totalUsersCount) {
    throw new HttpError(messageConstant.NO_ACTIVE_USERS_FOUND, httpStatusConstant.BAD_REQUEST)
  }

  const totalPages = Math.ceil(totalUsersCount / pageSize)

  if (page > totalPages) {
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
    .limit(pageSize)

  if (!activeUsers?.length) {
    throw new HttpError(messageConstant.NO_ACTIVE_USERS_FOUND, httpStatusConstant.BAD_REQUEST)
  }

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    data: {
      activeUsers,
      pagination: {
        page: page,
        pageSize: pageSize,
        totalPages
      }
    },
    message: httpErrorMessageConstant.SUCCESSFUL
  })
}

/**
 * @description Deactivates a user account (soft delete).
 */
const deactivateUser: Controller = async (req: Request, res: Response) => {
  const { userId } = req.params

  const user = await User.findOne({ _id: ObjectId.createFromHexString(userId), deletedAt: null })
  if (!user) {
    throw new HttpError(messageConstant.USER_NOT_FOUND, httpStatusConstant.BAD_REQUEST)
  }

  const updatedUser = await User.findOneAndUpdate(
    { _id: ObjectId.createFromHexString(userId) },
    { $set: { deletedAt: Date.now() } },
    { new: true }
  )

  if (!updatedUser) {
    throw new HttpError(
      messageConstant.ERROR_DELETING_USER,
      httpStatusConstant.INTERNAL_SERVER_ERROR
    )
  }

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: messageConstant.USER_DELETED_SOFT
  })
}

/**
 * @description Permanently removes a user.
 */
const deleteUserPermanently: Controller = async (req: Request, res: Response) => {
  const { userId } = req.params

  const user = await User.findById({ _id: ObjectId.createFromHexString(userId) })
  if (!user) {
    throw new HttpError(messageConstant.USER_NOT_FOUND, httpStatusConstant.BAD_REQUEST)
  }

  const deletedUser = await User.deleteOne({ _id: ObjectId.createFromHexString(userId) })
  if (!deletedUser) {
    throw new HttpError(
      messageConstant.ERROR_DELETING_USER,
      httpStatusConstant.INTERNAL_SERVER_ERROR
    )
  }

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: messageConstant.USER_DELETED_HARD
  })
}

export default {
  addUser,
  getActiveUsersList,
  deactivateUser,
  deleteUserPermanently
}
