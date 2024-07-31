import express, { Router } from 'express'
import { celebrate } from 'celebrate'
import { cartOperationsSchema } from '../../validations'
import { cartOperationsController } from '../../controllers'
import { wrapController } from '../../middlewares'

const router: Router = express.Router()

router.post(
  '/new/item/add',
  celebrate(cartOperationsSchema.addItemToNewCartValidation),
  wrapController(cartOperationsController.addItemToNewCart)
)
router.put(
  '/existing/item/add',
  celebrate(cartOperationsSchema.addItemToExistingCartValidation),
  wrapController(cartOperationsController.addItemToExistingCart)
)
router.put(
  '/item/remove',
  celebrate(cartOperationsSchema.removeItemFromCartValidation),
  wrapController(cartOperationsController.removeItemFromCart)
)
router.get(
  '/item/list/:cartId/:userId',
  celebrate(cartOperationsSchema.getCartItemsValidation),
  wrapController(cartOperationsController.getCartItems)
)
router.put(
  '/deactivate/:cartId',
  celebrate(cartOperationsSchema.deleteCartValidation),
  wrapController(cartOperationsController.deactivateCart)
)
router.delete(
  '/:cartId',
  celebrate(cartOperationsSchema.deleteCartValidation),
  wrapController(cartOperationsController.deleteCartPermanently)
)

export default router
