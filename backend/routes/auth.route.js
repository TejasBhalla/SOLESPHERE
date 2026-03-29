import express from 'express';
import { getProfile, login, logout, refreshToken, signup } from '../controller/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';
const router = express.Router();


router.post("/signup",signup)

router.post('/login',login)

router.post('/refreshToken',refreshToken)

router.post("/logout",logout)

router.get("/profile",protectRoute,getProfile)

export default router