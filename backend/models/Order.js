// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
        name: String,
        address: String,
        whatsapp: String,
        quantity: Number,
        totalAmount: Number,
        status: { type: String, enum: ["pending", "completed"], default: "pending" },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
