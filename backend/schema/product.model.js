import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'name is required']
    },
    price: {
        type:Number,
        required: [true ,'price is required']

    },
    description:{
        type: String,
        required: [true,'description is required']
    },
    image:{
        type: String,
        
    },
    category:{
        type: String,
        required : [true,'category is required']
    },
    isFeatured:{
        type: Boolean,
        default : false 
    },
    cloudinary_id: {
        type:String
    }

},{timestamps:true})

const Product = mongoose.model("Product",productSchema);

export default Product