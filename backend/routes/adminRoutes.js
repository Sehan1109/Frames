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

export default router;
