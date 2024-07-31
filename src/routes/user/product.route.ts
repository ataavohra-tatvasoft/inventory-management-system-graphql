import express, { Router } from 'express'
import { celebrate } from 'celebrate'
import { userProductSchema } from '../../validations'
import { userProductController } from '../../controllers'
import { wrapController } from '../../middlewares'

const router: Router = express.Router()

router.post(
  '/product/review',
  celebrate(userProductSchema.addProductReviewValidation),
  wrapController(userProductController.addReview)
)
router.post(
  '/product/rating',
  celebrate(userProductSchema.addProductRatingValidation),
  wrapController(userProductController.addRating)
)
router.delete(
  '/product/review/:reviewId',
  celebrate(userProductSchema.deleteReviewPermanentlyValidation),
  wrapController(userProductController.deleteReviewPermanently)
)
router.delete(
  '/product/rating/:ratingId',
  celebrate(userProductSchema.deleteRatingPermanentlyValidation),
  wrapController(userProductController.deleteRatingPermanently)
)

export default router
