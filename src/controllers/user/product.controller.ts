import { Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { httpErrorMessageConstant, httpStatusConstant, messageConstant } from '../../constants'
import { Product, ProductRating, ProductReview, User } from '../../db/models'
import { HttpError } from '../../libs'
import { Controller } from '../../types'
import { responseHandlerUtils } from '../../utils'

/**
 * @description Adds a new review for a product identified by productId, associated with a user identified by userId.
 */
const addReview: Controller = async (req: Request, res: Response) => {
  const { productId, userId, review } = req.body

  const productExists = await Product.findOne({
    _id: ObjectId.createFromHexString(productId),
    deletedAt: null
  })
  if (!productExists) {
    throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const userExists = await User.findOne({
    _id: ObjectId.createFromHexString(userId),
    deletedAt: null
  })
  if (!userExists) {
    throw new HttpError(messageConstant.USER_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const newReview = await ProductReview.create({
    productId: productExists._id,
    userId: userExists._id,
    review
  })

  if (!newReview) {
    throw new HttpError(messageConstant.ERROR_ADD_REVIEW, httpStatusConstant.BAD_REQUEST)
  }

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: httpErrorMessageConstant.SUCCESSFUL,
    data: newReview
  })
}

/**
 * @description Adds a new rating for a product identified by productId, associated with a user identified by userId.
 */
const addRating: Controller = async (req: Request, res: Response) => {
  const { productId, userId, rating } = req.body

  const productExists = await Product.findOne({
    _id: ObjectId.createFromHexString(productId),
    deletedAt: null
  })
  if (!productExists) {
    throw new HttpError(messageConstant.PRODUCT_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const userExists = await User.findOne({
    _id: ObjectId.createFromHexString(userId),
    deletedAt: null
  })
  if (!userExists) {
    throw new HttpError(messageConstant.USER_NOT_FOUND, httpStatusConstant.NOT_FOUND)
  }

  const newRating = await ProductRating.create({
    productId: productExists._id,
    userId: userExists._id,
    rating
  })

  if (!newRating) {
    throw new HttpError(messageConstant.ERROR_ADD_RATING, httpStatusConstant.BAD_REQUEST)
  }

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: httpErrorMessageConstant.SUCCESSFUL,
    data: newRating
  })
}

/**
 * @description Permanently removes a review.
 */
const deleteReviewPermanently: Controller = async (req: Request, res: Response) => {
  const { reviewId } = req.params

  const review = await ProductReview.findById({ _id: ObjectId.createFromHexString(reviewId) })
  if (!review) {
    throw new HttpError(messageConstant.REVIEW_NOT_FOUND, httpStatusConstant.BAD_REQUEST)
  }

  const deletedReview = await ProductReview.deleteOne({
    _id: ObjectId.createFromHexString(reviewId)
  })
  if (!deletedReview) {
    throw new HttpError(
      messageConstant.ERROR_DELETING_REVIEW,
      httpStatusConstant.INTERNAL_SERVER_ERROR
    )
  }

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: messageConstant.REVIEW_DELETED_HARD
  })
}

/**
 * @description Permanently removes a rating.
 */
const deleteRatingPermanently: Controller = async (req: Request, res: Response) => {
  const { ratingId } = req.params

  const rating = await ProductRating.findById({ _id: ObjectId.createFromHexString(ratingId) })
  if (!rating) {
    throw new HttpError(messageConstant.RATING_NOT_FOUND, httpStatusConstant.BAD_REQUEST)
  }

  const deletedRating = await ProductRating.deleteOne({
    _id: ObjectId.createFromHexString(ratingId)
  })
  if (!deletedRating) {
    throw new HttpError(
      messageConstant.ERROR_DELETING_RATING,
      httpStatusConstant.INTERNAL_SERVER_ERROR
    )
  }

  return responseHandlerUtils.responseHandler(res, {
    statusCode: httpStatusConstant.OK,
    message: messageConstant.RATING_DELETED_HARD
  })
}

export default {
  addReview,
  addRating,
  deleteReviewPermanently,
  deleteRatingPermanently
}
