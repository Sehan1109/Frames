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

// ✅ Delete order (admin only)
router.delete("/:id", protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        await order.deleteOne();
        res.json({ message: "Order deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete order" });
    }
});

export default router;
