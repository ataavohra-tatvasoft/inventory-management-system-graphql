import { Joi } from 'celebrate'

const addProductReviewValidation = {
  body: Joi.object().keys({
    productId: Joi.string().required(),
    userId: Joi.string().required(),
    review: Joi.string().required()
  })
}
const addProductRatingValidation = {
  body: Joi.object().keys({
    productId: Joi.string().required(),
    userId: Joi.string().required(),
    rating: Joi.number().integer().min(0).max(5).required()
  })
}
const deleteReviewPermanentlyValidation = {
  params: Joi.object().keys({
    reviewId: Joi.string().required()
  })
}
const deleteRatingPermanentlyValidation = {
  params: Joi.object().keys({
    ratingId: Joi.string().required()
  })
}

export default {
  addProductReviewValidation,
  addProductRatingValidation,
  deleteReviewPermanentlyValidation,
  deleteRatingPermanentlyValidation
}
