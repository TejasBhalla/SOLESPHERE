import User from '../schema/user.model.js';
import jwt from 'jsonwebtoken';
import redis from '../config/redis.js';
import dotenv from 'dotenv';
dotenv.config()

const generateTokens= (userId) => {
    const accessToken = jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '15m'})

    const refreshToken = jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET,{
        expiresIn: '7d'
    })

    return {accessToken, refreshToken};
}

const storeRefreshToken = async (userId, refreshToken) =>{
    await redis.set(userId, refreshToken, 'EX',7*24*60*60)

}

const setCookies = (res, accessToken, refreshToken) =>{
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000 
    })
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60 * 1000
    })
}

export const signup =  async (req,res)=>{
    const {name,email,password} = req.body;
    console.log(req.body) // ✅ check if it's being received properly
    const userExist = await User.findOne({email});
    if (userExist) {
        return res.status(400).json({message: "user already exists"});
    }
    try{
        const user = await User.create({name,email,password});
        const {accessToken, refreshToken} = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        return res.status(201).json({message: "user created successfully", user:{_id: user._id, name: user.name, email: user.email, role: user.role}});
    }
    catch(error){
        return res.status(500).json({message: "Internal server error",error});
    }
}

export const login = async (req,res) =>{
    const {email, password} = req.body;
    const user = await User.findOne({email})
    if(!user) {
       return res.status(400).json({message:"could not find the user"})
    }
    if (await user.comparePassword(password)) {
        try {
        const {accessToken, refreshToken} = generateTokens(user._id);
        await storeRefreshToken(user._id, refreshToken);
        setCookies(res, accessToken, refreshToken);

        return res.status(201).json({message: "user logined successfully", user:{_id: user._id, name: user.name, email: user.email, role: user.role}});
        } catch (error) {
           return res.status(400).json({message : error.message})
        }
    }
    return res.status(400).json({message:'wrong password try again'});



}

export const refreshToken = async (req,res) =>{
    const refreshToken = req.cookies.refreshToken
    const decode = jwt.verify(refreshToken , process.env.REFRESH_TOKEN_SECRET);
    const storedToken = await redis.get(decode.userId)
    if (refreshToken!== storedToken) {
        return res.status(400).json({message: 'refresh token does not match'})
    }

    const accessToken = jwt.sign({userId: decode.userId}, process.env.ACCESS_TOKEN_SECRET , {
        expiresIn: '15m'
    })
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 * 1000 
    })
    return res.status(201).json({message: 'access token successfully refreshed'})
}

export const getProfile = async (req,res) => {
    const user = req.user
    return res.status(201).json({user:user})

}

export const logout = async (req,res) => {
    try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        const decode= jwt.verify(refreshToken ,process.env.REFRESH_TOKEN_SECRET);
        await redis.del(decode.userId);
    }

    res.clearCookie('accessToken')
    res.clearCookie('refreshToken');
    return res.status(201).json({message: "Logged out successfully"});
} catch (error) {
    return res.status(500).json({message: "Internal server error", error});
}
}