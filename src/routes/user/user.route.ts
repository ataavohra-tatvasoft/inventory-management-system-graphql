import express, { Router } from 'express'
import { celebrate } from 'celebrate'
import { userOperationsSchema } from '../../validations'
import { userOperationsController } from '../../controllers'
import { wrapController } from '../../middlewares'

const router: Router = express.Router()

router.post(
  '/new',
  celebrate(userOperationsSchema.addUserValidation),
  wrapController(userOperationsController.addUser)
)
router.get(
  '/list',
  celebrate(userOperationsSchema.getActiveUsersListValidation),
  wrapController(userOperationsController.getActiveUsersList)
)
router.put(
  '/deactivate/:userId',
  celebrate(userOperationsSchema.deactivateUserValidation),
  wrapController(userOperationsController.deactivateUser)
)
router.delete(
  '/:userId',
  celebrate(userOperationsSchema.deleteUserPermanentlyValidation),
  wrapController(userOperationsController.deleteUserPermanently)
)

export default router
