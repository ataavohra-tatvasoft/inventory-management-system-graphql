import { ObjectId } from 'mongodb'
import { Product, ProductRating, ProductReview, User } from '../../../db/models'
import { HttpError } from '../../../libs'
import { httpErrorMessageConstant, httpStatusConstant, messageConstant } from '../../../constants'

const productResolver = {
  Mutation: {
    addReview: async (
      _: any,
      {
        reviewInput
      }: {
        reviewInput: { productId: string; userId: string; review: string }
      }
    ) => {
      const { productId, userId, review } = reviewInput

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

      return {
        statusCode: httpStatusConstant.OK,
        message: httpErrorMessageConstant.SUCCESSFUL,
        data: newReview
      }
    },

    addRating: async (
      _: any,
      {
        ratingInput
      }: {
        ratingInput: { productId: string; userId: string; rating: number }
      }
    ) => {
      const { productId, userId, rating } = ratingInput

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

      return {
        statusCode: httpStatusConstant.OK,
        message: httpErrorMessageConstant.SUCCESSFUL,
        data: newRating
      }
    },

    deleteReviewPermanently: async (_: any, { reviewId }: { reviewId: string }) => {
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

      return {
        statusCode: httpStatusConstant.OK,
        message: messageConstant.REVIEW_DELETED_HARD
      }
    },

    deleteRatingPermanently: async (_: any, { ratingId }: { ratingId: string }) => {
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

      return {
        statusCode: httpStatusConstant.OK,
        message: messageConstant.RATING_DELETED_HARD
      }
    }
  }
}

export default { productResolver }
