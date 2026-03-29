import express from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required : [true, "name is required"]
    },
    email:{
        type: String,
        required :[true, "email is required"],
        trim:true,
        unique:true,
        lowercase:true ,
    } ,
    password : {
        type: String,
        required: [true,"password is required"],
        minlength: [8, "password must be at least 8 characters long"],
    },
    cart:[{
        id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },

},{timestamps: true})

userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password,salt);
        next();
    }
    catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);   
}
    

const User=mongoose.model('User',userSchema);

export default User;