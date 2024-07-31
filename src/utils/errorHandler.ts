import { Request, Response, NextFunction } from 'express'
import responseHandlerUtils from './responseHandler.utils'
import { httpStatusConstant } from '../constants'
import { HttpError } from '../libs'

// eslint-disable-next-line no-unused-vars
const errorHandler = (error: HttpError, req: Request, res: Response, next: NextFunction) => {
  console.log('Err', error)
  const statusCode = error.statusCode || httpStatusConstant.INTERNAL_SERVER_ERROR
  return responseHandlerUtils.responseHandler(res, {
    statusCode,
    message: error.message,
    error
  })
}

export default {
  errorHandler
}
