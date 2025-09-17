// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
            quantity: Number,
            price: Number,
        },
    ],
    totalAmount: Number, // store total at checkout
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, default: "pending" }, // pending, paid, shipped...
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
