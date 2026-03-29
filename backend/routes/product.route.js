import express from 'express';
import Product from '../schema/product.model.js';
import dotenv from 'dotenv';
import {createProduct, deleteProduct, getAllProducts, getCategoryProducts, getFeaturedProducts, getRecommendedProducts, toggleFeaturedProducts} from '../controller/product.controller.js'
import { adminRoute, protectRoute } from '../middleware/auth.middleware.js';

dotenv.config();
const router = express.Router();

router.get('/', protectRoute,adminRoute,getAllProducts)

router.get('/featured',getFeaturedProducts)

router.get('/recommendations',getRecommendedProducts)

router.get('/category/:category',getCategoryProducts)

router.patch('/:id',protectRoute,adminRoute,toggleFeaturedProducts)

router.post('/',protectRoute,adminRoute,createProduct)

router.post('/:id',protectRoute,adminRoute,deleteProduct)

export default router