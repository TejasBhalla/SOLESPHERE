import express from 'express'
import { addToCart, changeProductQuantity, getCart, removeFromCart } from '../controller/cart.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()

router.get("/",protectRoute,getCart)
router.post("/",protectRoute,addToCart)
router.delete("/",protectRoute,removeFromCart)
router.patch("/",protectRoute,changeProductQuantity)

export default router