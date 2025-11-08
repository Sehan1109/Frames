// routes/orderRoutes.js
import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
    try {
        const {
            name, address, whatsapp,
            price, // This will be the totalAmount

            // Case 1: Single item order (from ItemPage)
            productId, quantity,

            // Case 2: Cart order
            items
        } = req.body;

        let order;

        if (items && items.length > 0) {
            // This is a Cart Order
            order = new Order({
                user: req.user._id,
                items: items, // Expects an array from the frontend cart
                name,
                address,
                whatsapp,
                totalAmount: price, // 'price' is the totalAmount
                status: "pending", // All payments start as pending
            });
        } else if (productId) {
            // This is a Single Item Order (from ItemPage)
            order = new Order({
                user: req.user._id,
                product: productId,
                quantity,
                name,
                address,
                whatsapp,
                totalAmount: price,
                status: "pending",
            });
        } else {
            return res.status(400).json({ message: "No items or product in order" });
        }

        await order.save();
        res.status(201).json({ message: "Order placed", order });
    } catch (err) {
        console.error("Order creation error:", err);
        res.status(500).json({ message: "Failed to place order" });
    }
});

export default router;
