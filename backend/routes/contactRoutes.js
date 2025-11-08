import express from "express";
import Message from "../models/Message.js";

const router = express.Router();

// @route   POST /api/contact/send
// @desc    Receive a new contact form message
// @access  Public
router.post("/send", async (req, res) => {
    const { email, message } = req.body;

    if (!email || !message) {
        return res.status(400).json({ message: "Please provide email and message." });
    }

    try {
        const newMessage = new Message({
            email,
            message,
        });

        await newMessage.save();

        res.status(201).json({ message: "Message received successfully!" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;