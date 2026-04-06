import express from 'express'
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js'
import { checkoutSuccess, createOrderSession, getAllOrders } from '../controller/order.controller.js'

const router = express.Router()


router.get("/", protectRoute, adminRoute, getAllOrders)
router.post("/create-checkout-session", protectRoute, createOrderSession)
router.post("/checkout-success", protectRoute, checkoutSuccess)

export default router