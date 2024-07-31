import express, { Router } from 'express'
import userRoutes from './user'
import productRoutes from './product'
import cartRoutes from './cart'

const router: Router = express.Router()

/** User Routes */
router.use('/user', userRoutes)

/** Product Routes */
router.use('/product', productRoutes)

/** Cart Routes */
router.use('/cart', cartRoutes)

export default router
