import express, { Router } from 'express'
import { celebrate } from 'celebrate'
import { productOperationsSchema } from '../../validations'
import { productOperationsController } from '../../controllers'
import { wrapController } from '../../middlewares'
import { multerConfigUtils } from '../../utils'

const router: Router = express.Router()

router.post(
  '/new',
  celebrate(productOperationsSchema.addProductValidation),
  wrapController(productOperationsController.addProduct)
)
router.post(
  '/attribute/:productId',
  celebrate(productOperationsSchema.addProductAttributeValidation),
  wrapController(productOperationsController.addProductAttribute)
)

router.post(
  '/attribute/options/:productId/:attributeId',
  celebrate(productOperationsSchema.addProductOptionsValidation),
  wrapController(productOperationsController.addProductOptions)
)

router.delete(
  '/attribute/:productId/:attributeId',
  celebrate(productOperationsSchema.removeProductAttributeValidation),
  wrapController(productOperationsController.removeProductAttribute)
)

router.delete(
  '/attribute/options/:productId/:attributeId',
  celebrate(productOperationsSchema.removeProductOptionsValidation),
  wrapController(productOperationsController.removeProductOptions)
)
router.get('/list', wrapController(productOperationsController.productsList))
router.patch(
  '/:productId',
  celebrate(productOperationsSchema.updateProductValidation),
  wrapController(productOperationsController.updateProduct)
)
router.put(
  '/upload/coverimage/:productId',
  celebrate(productOperationsSchema.uploadProductImageValidation),
  multerConfigUtils.upload.single('productCoverImage'),
  wrapController(productOperationsController.uploadProductImage)
)
router.get(
  '/summary/reviews/:productId',
  celebrate(productOperationsSchema.reviewsSummaryValidation),
  wrapController(productOperationsController.reviewsSummary)
)
router.get(
  '/summary/ratings/:productId',
  celebrate(productOperationsSchema.ratingsSummaryValidation),
  wrapController(productOperationsController.ratingsSummary)
)
router.put(
  '/deactivate/:productId',
  celebrate(productOperationsSchema.deleteProductValidation),
  wrapController(productOperationsController.deactivateProduct)
)
router.delete(
  '/:productId',
  celebrate(productOperationsSchema.deleteProductValidation),
  wrapController(productOperationsController.deleteProductPermanently)
)

export default router
