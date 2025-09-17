// routes/adminRoutes.js
import express from "express";
import Order from "../models/Order.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET revenue & orders count
router.get("/stats", protect, adminOnly, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalRevenueAgg = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);

        const totalRevenue =
            totalRevenueAgg.length > 0 ? totalRevenueAgg[0].total : 0;

        res.json({ totalOrders, totalRevenue });
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch stats" });
    }
});

// Get all orders
router.get("/orders", protect, adminOnly, async (req, res) => {
    try {
        const orders = await Order.find().populate("product", "title price");
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch orders" });
    }
});

// ✅ Mark order complete
router.put("/orders/:id/complete", protect, adminOnly, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        order.status = "completed";
        await order.save();

        // Optional: Recalculate stats
        const totalOrders = await Order.countDocuments({ status: "pending" });
        const completedOrders = await Order.countDocuments({ status: "completed" });
        const totalRevenue = await Order.aggregate([
            { $match: { status: "completed" } },
            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
        ]);

        res.json({
            message: "Order marked as completed",
            order,
            stats: {
                totalOrders,
                completedOrders,
                totalRevenue: totalRevenue[0]?.total || 0,
            },
        });
    } catch (err) {
        res.status(500).json({ message: "Failed to update order" });
    }
});

export default router;
