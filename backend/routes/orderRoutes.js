// routes/orderRoutes.js
import express from "express";
import Order from "../models/Order.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
    try {
        const { productId, name, address, whatsapp, quantity, price } = req.body;

        const order = new Order({
            user: req.user._id,
            product: productId,
            name,
            address,
            whatsapp,
            quantity,
            totalAmount: price,
        });

        await order.save();
        res.status(201).json({ message: "Order placed", order });
    } catch (err) {
        res.status(500).json({ message: "Failed to place order" });
    }
});

export default router;
