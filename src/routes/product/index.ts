import express, { Router } from 'express'
import productOperations from './product.route'

const router: Router = express.Router()

/** Product Routes */
router.use(productOperations)

export default router
