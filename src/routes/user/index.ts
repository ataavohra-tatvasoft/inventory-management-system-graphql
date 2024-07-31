import express, { Router } from 'express'
import userOperations from './user.route'
import productOperations from './product.route'

const router: Router = express.Router()

/** User Routes */
router.use(userOperations)

/** Product Routes */
router.use(productOperations)

export default router
