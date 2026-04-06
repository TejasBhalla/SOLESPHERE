import Stripe from 'stripe'
import dotenv from 'dotenv'
dotenv.config()

let stripeClient = null

export const getStripeClient = () => {
	if (stripeClient) {
		return stripeClient
	}

	const secretKey = process.env.STRIPE_SECRET_KEY
	if (!secretKey) {
		return null
	}

	stripeClient = new Stripe(secretKey)
	return stripeClient
}