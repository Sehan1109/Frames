import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  price: { type: Number, default: 0 },
  category: {
    type: String,
    enum: ["Phones", "Watches", "Accessories", "Others"],
    required: true
  }
}, { timestamps: true });

const Item = mongoose.model("Item", itemSchema);
export default Item;
