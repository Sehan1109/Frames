// routes/adminRoutes.js
import express from "express";
import Order from "../models/Order.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import Message from "../models/Message.js";

const router = express.Router();

// GET revenue & orders count
router.get("/stats", protect, adminOnly, async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();
        const totalRevenueAgg = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalAmount" } } },
        ]);
        const newOrders = await Order.countDocuments({ status: "pending" });
        const unreadMessages = await Message.countDocuments({ read: false });

        const totalRevenue =
            totalRevenueAgg.length > 0 ? totalRevenueAgg[0].total : 0;

        res.json({ totalOrders, totalRevenue, newOrders, unreadMessages });
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

// ✅ Delete order (admin only)
router.delete("/orders/:id/delete", protect, async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });

        await order.deleteOne();
        res.json({ message: "Order deleted" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete order" });
    }
});


// === Messages Routes === //

// Get all messages
router.get("/messages", protect, adminOnly, async (req, res) => {
    try {
        const message = await Message.find().sort({ createdAt: -1 });
        res.json(message);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch messages" });
    }
});

// Put mark message as read
router.put("/messages/:id/read", protect, adminOnly, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ message: "Message not found" });

        message.read = true;
        await message.save();

        // Send back the updated message and the new unread count
        const unreadMessages = await Message.countDocuments({ read: false });
        res.json({ message, unreadMessages });
    } catch (err) {
        res.status(500).json({ message: "Failed to update message " });
    }
});

// Delete a message
router.delete("/messages/:id", protect, adminOnly, async (req, res) => {
    try {
        const message = await Message.findById(req.params.id);
        if (!message) return res.status(404).json({ message: "Message not found" });

        await message.deleteOne();

        // Send back the new unread count
        const unreadMessages = await Message.countDocuments({ read: false });
        res.json({ message: "Message deleted", unreadMessages });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete message" });
    }
});

export default router;
