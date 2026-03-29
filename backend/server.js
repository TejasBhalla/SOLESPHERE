import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoute from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import productRoute from './routes/product.route.js'
import cartRoute from './routes/cart.route.js'
import orderRoute from './routes/order.route.js'
import cors from 'cors'
dotenv.config();
const app=express();
const PORT=process.env.PORT;
connectDB();
app.use(express.json({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5173', // your frontend URL
  credentials: true,
}))

app.use('/api/auth', authRoute)
app.use('/api/product',productRoute)
app.use('/api/cart',cartRoute)
app.use('/api/order',orderRoute)
app.listen(PORT , ()=>{
    console.log(`server is running on ${PORT}`);
})

