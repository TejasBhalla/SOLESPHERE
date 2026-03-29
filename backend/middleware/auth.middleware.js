import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import User from '../schema/user.model.js'
dotenv.config()
export const protectRoute = async (req,res,next) =>{
    const accessToken = req.cookies.accessToken
    if(!accessToken) {
        return res.status(400).json({message: 'access token not found'})
    }
    try {
    const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decode.userId).select('-password')
    if(!user) {
        return res.status(401).json({message: 'user not found'})
    }

    req.user = user;
    next();
}  catch(error) {
    return res.status(500).json({message:'server error', error:error.message})
}
  
}

export const adminRoute = (req,res,next) =>{
    const user=req.user;
    if(user && user.role==='admin') {
        return next();
    }
    return res.status(403).json({message:"user not authorized"})
}