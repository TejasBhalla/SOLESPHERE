import express from 'express'
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js'
import { createOrderSession, getAllOrders } from '../controller/order.controller.js'

const router = express.Router()


router.get("/",protectRoute,adminRoute,getAllOrders)
router.get("/",protectRoute,createOrderSession)

export default router