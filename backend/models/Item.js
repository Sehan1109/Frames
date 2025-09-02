import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String },
  category: {
    type: String,
    enum: ["Academics", "Sports", "Events", "Notices"],
    required: true
  },
  createdAt: { type: Date, default: Date.now }
});

const Item = mongoose.model("Item", itemSchema);
export default Item;
