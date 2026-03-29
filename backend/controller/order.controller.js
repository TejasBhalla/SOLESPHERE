import Order from "../schema/order.model.js"
import Product from "../schema/product.model.js"

export const createOrderSession = async (req, res) => {
    const user = req.user
    const cartExist = user.cart
    if (cartExist.length === 0) {
        return res.status(404).json({ message: 'cart is empty' })
    }
    var totalAmount
    for (const item of cartExist) {
        const product = await Product.findById(item.product)
        productPrice = product.price * item.quantity
        totalAmount += productPrice
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({})        //populate
        if (!orders) {
            return res.status(404).json({ message: "no orders found" })
        }
        return res.status(202).json(orders)
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}