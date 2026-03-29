import Product from "../schema/product.model.js";
import User from "../schema/user.model.js";

export const addToCart = async (req, res) => {
    try {
        const { productId } = req.body
        const user = req.user
        const productExists = await Product.findById(productId);
        console.log("User cart:", user.cart);
        if (!productExists) {
            return res.status(404).json({ message: 'Product not found' });
        }
        const existingItem = user.cart.find((item) => productId === item.id.toString())
        if (existingItem) {
            existingItem.quantity += 1
        } else {
            user.cart.push({ id: productId, quantity: 1 })
        }
        await user.save()
        return res.status(200).json({ message: "added product to cart", items: user.cart });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.body
        const user = req.user
        user.cart = user.cart.filter((items) => items.id.toString() !== productId)
        await user.save()
        return res.status(200).json({ message: "product removed from cart", items: user.cart });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}

export const changeProductQuantity = async (req, res) => {
    try {
        const { productId, action } = req.body
        const user = req.user
        const product = user.cart.find((item) => item.id.toString() === productId)
        if (!product) {
            return res.status(404).json({ message: "product not found" })
        }
        if (action == "inc") {
            product.quantity += 1
        }
        else if (action == "dec") {
            product.quantity -= 1
            if (product.quantity <= 0) {
                user.cart = user.cart.filter((item) => item.id.toString() !== productId)
            }
        }
        else {
            return res.status(402).json({ message: "action can only be inc or dec" })
        }
        await user.save()
        return res.status(200).json({ message: "qauntity of product changed", items: user.cart });
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })

    }

}

export const getCart = async (req,res) =>{
    const user = await User.findById(req.user._id).populate('cart.id')
    const cartItems = user.cart
    if(!cartItems) {
        return res.status(404).json({ message: "cart is empty" })
    }
    return res.status(200).json({ message: "cart items", items: user.cart });
}