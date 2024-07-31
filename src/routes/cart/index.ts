import express, { Router } from 'express'
import cartOperations from './cart.route'

const router: Router = express.Router()

/** Cart Routes */
router.use(cartOperations)

export default router
