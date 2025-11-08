// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // For multi-item cart orders
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    title: String,   // Denormalize title for easy access
    price: Number,   // Denormalize price at time of order
    quantity: Number
  }],

  // For single-item "buy now" orders (from ItemPage)
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
  quantity: Number,

  // Shared info
  name: String,
  address: String,
  whatsapp: String,
  totalAmount: Number,
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
}, { timestamps: true });


export default mongoose.model("Order", orderSchema);
