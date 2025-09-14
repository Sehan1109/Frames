import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv"

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
});

// Create checkout session
router.post("/create-checkout-session", async (req, res) => {
    try {
        const { cart } = req.body;

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: cart.map((item) => ({
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: item.title,
                    },
                    unit_amount: item.price * 100, // amount in cents
                },
                quantity: item.quantity || 1,
            })),
            success_url: "http://localhost:5173/success",
            cancel_url: "http://localhost:5173/cart",
        });

        res.json({ id: session.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
