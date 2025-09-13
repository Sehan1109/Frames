import express from "express";
import Stripe from "stripe";

console.log("Stripe Key Loaded:", process.env.STRIPE_SECRET_KEY ? "✅ YES" : "❌ NO");

const router = express.Router();
const stripe = new Stripe("sk_test_51S6AMCL1PGDmrKPOj3qYeA4hrm5mUy0vzLoUaF8MctL2IziOEtgiBm9NSYCn66oODtwgiM2pl1P9M80jZW7ryK5X009liYDLY5", {
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
