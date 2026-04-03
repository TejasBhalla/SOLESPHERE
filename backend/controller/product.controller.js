import Product from '../schema/product.model.js'
import mongoose from 'mongoose'
import redis from '../config/redis.js'
import cloudinary from '../config/cloudinary.js'
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({})
        return res.status(201).json({ data: products })
    } catch (error) {
        return res.status(400).json({ message: 'server error', error: error.message })
    }

}

export const getFeaturedProducts = async (req, res) => {
    try {
        let fProducts = await redis.get("f_products")
        if (fProducts) {
            return res.status(201).json(JSON.parse(fProducts))
        }

        fProducts = await Product.find({ isFeatured: true }).lean()
        if (!fProducts) {
            return res.status(401).json({ message: "no products found" })
        }
        await redis.set("f_products", JSON.stringify(fProducts))
        return res.status(201).json({ data: fProducts })
    } catch (error) {
        return res.status(400).json({ message: 'server error', error: error.message })

    }
}

export const createProduct = async (req, res) => {
    try {
        const { name, description, price, category, image } = req.body
        let cloudinaryResponse = null
        if (image) {
            cloudinaryResponse = await cloudinary.uploader.upload(image, { folder: 'products' })
        }
        const product = await Product.create({
            name,
            description,
            price,
            category,
            image: cloudinaryResponse?.secure_url || null,
            cloudinary_id: cloudinaryResponse?.public_id || null
        })
        return res.status(201).json({ product })
    } catch (error) {
        return res.status(400).json({ message: 'server error', error: error.message })

    }

}

export const deleteProduct = async (req, res) => {
    try {
        const id = req.params.id
        const deletedProduct = await Product.findByIdAndDelete(id)
        if (!deletedProduct) {
            return res.status(404).json({ message: "product not found" })
        }
        if (deletedProduct.image) {
            const cloudinary_id = deletedProduct.cloudinary_id
            await cloudinary.uploader.destroy(cloudinary_id)
        }
        return res.status(201).json({ message: " product deleted successfully", data: deletedProduct })
    } catch (error) {
        return res.status(400).json({ message: 'server error', error: error.message })

    }
}

export const getRecommendedProducts = async (req, res) => {
    try {
        const products = await Product.aggregate([{
            $sample: { size: 3 }
        }, {
            $project: {
                _id: 1,
                name: 1,
                image: 1,
                price: 1,
                description: 1
            }
        }])
        return res.status(200).json({ products });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }

}

export const getCategoryProducts = async (req, res) => {
    try {
        const category = req.params.category
        const products = await Product.find({ category })
        return res.status(200).json({ products });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }

}

export const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid product id' })
        }

        const product = await Product.findById(id)
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }

        return res.status(200).json({ product })
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const toggleFeaturedProducts = async (req, res) => {
    try {
        const id = req.params.id
        const product = await Product.findById(id)
        if(!product) {
            return res.status(404).json({ message: "product not found" })
        }
        product.isFeatured = !product.isFeatured
        const updatedProduct = await product.save()
        await updateFeaturedProductCache()
        return res.status(200).json({ message:"toggled featured product" ,data:updatedProduct });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })

    }
}

const updateFeaturedProductCache = async () =>{
    const products = await Product.find({isFeatured:true})
    await redis.set("f_products",JSON.stringify(products))
}