import Order from "../schema/order.model.js"
import User from "../schema/user.model.js"
import { getStripeClient } from "../config/stripe.js"

export const createOrderSession = async (req, res) => {
    try {
        const stripe = getStripeClient()
        console.log("Stripe instance:", stripe)
        if (!stripe) {
            return res.status(500).json({ message: "Stripe is not configured. Please set STRIPE_SECRET_KEY in backend/.env" })
        }

        const user = await User.findById(req.user._id).populate("cart.id")
        const cartExist = user?.cart || []

        if (cartExist.length === 0) {
            return res.status(404).json({ message: "cart is empty" })
        }

        const lineItems = []
        let totalAmount = 0

        for (const item of cartExist) {
            const product = item.id
            if (!product) {
                continue
            }

            totalAmount += product.price * item.quantity

            lineItems.push({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: product.name,
                        images: product.image ? [product.image] : [],
                    },
                    unit_amount: Math.round(product.price * 100),
                },
                quantity: item.quantity,
            })
        }

        if (lineItems.length === 0) {
            return res.status(404).json({ message: "no valid products found in cart" })
        }

        const shippingAmount = totalAmount > 5000 ? 0 : 150
        if (shippingAmount > 0) {
            lineItems.push({
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: "Shipping",
                    },
                    unit_amount: shippingAmount * 100,
                },
                quantity: 1,
            })
            totalAmount += shippingAmount
        }

        const frontendUrl = process.env.CLIENT_URL || "http://localhost:5173"
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            payment_method_types: ["card"],
            line_items: lineItems,
            success_url: `${frontendUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${frontendUrl}/checkout`,
            metadata: {
                userId: req.user._id.toString(),
            },
        })

        return res.status(200).json({
            sessionId: session.id,
            sessionUrl: session.url,
            totalAmount,
        })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const checkoutSuccess = async (req, res) => {
    try {
        const stripe = getStripeClient()
        if (!stripe) {
            return res.status(500).json({ message: "Stripe is not configured. Please set STRIPE_SECRET_KEY in backend/.env" })
        }

        const { sessionId } = req.body
        if (!sessionId) {
            return res.status(400).json({ message: "sessionId is required" })
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId)
        if (!session || session.payment_status !== "paid") {
            return res.status(400).json({ message: "payment not completed" })
        }

        if (session?.metadata?.userId !== req.user._id.toString()) {
            return res.status(403).json({ message: "not authorized for this checkout session" })
        }

        const existingOrder = await Order.findOne({ stripeSessionId: session.id })
        if (existingOrder) {
            return res.status(200).json({ message: "order already processed", order: existingOrder })
        }

        const user = await User.findById(req.user._id).populate("cart.id")
        if (!user || user.cart.length === 0) {
            return res.status(404).json({ message: "cart is empty" })
        }

        const products = user.cart
            .filter((item) => item.id)
            .map((item) => ({
                product: item.id._id,
                quantity: item.quantity,
            }))

        const totalAmount = (session.amount_total || 0) / 100

        const order = await Order.create({
            user: req.user._id,
            products,
            totalAmount,
            stripeSessionId: session.id,
        })

        user.cart = []
        await user.save()

        return res.status(201).json({ message: "order created", order })
    } catch (error) {
        return res.status(500).json({ message: "Server error", error: error.message })
    }
}

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate("user", "name email").populate("products.product")
        if (orders.length === 0) {
            return res.status(404).json({ message: "no orders found" })
        }
        return res.status(200).json(orders)
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message })
    }
}