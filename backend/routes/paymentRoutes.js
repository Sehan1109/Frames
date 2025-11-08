import express from "express";
import Stripe from "stripe";
import dotenv from "dotenv";
import crypto from "crypto"; // Import the crypto module
import Order from "../models/Order.js"; // We need this to update the order

dotenv.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20",
});

// === STRIPE ROUTE (Existing) ===
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

// === PAYHERE ROUTES (New) ===

// 1. Generate Hash Endpoint
// Frontend will call this *after* creating a pending order
router.post("/payhere/generate-hash", (req, res) => {
    const { order_id, amount, currency } = req.body;
    const merchant_id = process.env.PAYHERE_MERCHANT_ID;
    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;

    if (!merchant_id || !merchant_secret) {
        console.error("PayHere credentials not set in .env");
        return res.status(500).json({ message: "Payment gateway not configured" });
    }

    // Format amount to 2 decimal places (required by PayHere)
    const amount_formatted = parseFloat(amount).toFixed(2);

    // Generate the hash
    // Formula: uppercase(md5(merchant_id + order_id + amount + currency + uppercase(md5(merchant_secret))))
    try {
        const secret_hash = crypto
            .createHash("md5")
            .update(merchant_secret)
            .digest("hex")
            .toUpperCase();

        const string_to_hash =
            merchant_id + order_id + amount_formatted + currency + secret_hash;

        const hash = crypto
            .createHash("md5")
            .update(string_to_hash)
            .digest("hex")
            .toUpperCase();

        console.log({
            merchant_id,
            order_id,
            amount_formatted,
            currency,
            secret_hash,
            final_hash: hash
        });

        res.json({ hash });
    } catch (err) {
        console.error("Error generating PayHere hash:", err);
        res.status(500).json({ message: "Error generating payment hash" });
    }
});

// 2. Notify URL (Webhook)
// PayHere will send a POST request here to confirm payment
router.post("/payhere/notify", async (req, res) => {
    const { order_id, status_code, md5sig, payhere_amount, payhere_currency } =
        req.body;
    const merchant_id = process.env.PAYHERE_MERCHANT_ID;
    const merchant_secret = process.env.PAYHERE_MERCHANT_SECRET;

    if (!merchant_id || !merchant_secret) {
        console.error("PayHere Notify: Credentials not set");
        return res.status(500).send("Internal Error");
    }

    // 1. Verify the md5sig to ensure the request is from PayHere
    try {
        const local_md5sig_string =
            merchant_id +
            order_id +
            payhere_amount +
            payhere_currency +
            status_code +
            crypto.createHash("md5").update(merchant_secret).digest("hex").toUpperCase();

        const local_md5sig = crypto
            .createHash("md5")
            .update(local_md5sig_string)
            .digest("hex")
            .toUpperCase();

        if (local_md5sig !== md5sig) {
            console.error("PayHere Notify: Invalid signature", {
                received: md5sig,
                calculated: local_md5sig,
            });
            return res.status(400).send("Invalid signature");
        }

        // 2. Signature is valid. Check payment status.
        if (status_code == 2) {
            // Payment successful
            const order = await Order.findById(order_id);
            if (order) {
                if (order.status === "pending") {
                    order.status = "completed";
                    await order.save();
                    console.log(`PayHere Notify: Order ${order_id} marked as completed.`);
                } else {
                    console.log(
                        `PayHere Notify: Order ${order_id} already processed.`
                    );
                }
            } else {
                console.warn(`PayHere Notify: Order ${order_id} not found.`);
            }
        } else {
            // Payment failed or was canceled
            console.log(
                `PayHere Notify: Payment for ${order_id} failed with status ${status_code}.`
            );
            // You could update the order to 'failed' here if you wish
        }

        // 3. Send 200 OK to PayHere
        res.status(200).send("OK");
    } catch (err) {
        console.error("PayHere Notify: Error processing webhook:", err);
        res.status(500).send("Error processing notification");
    }
});

export default router;
