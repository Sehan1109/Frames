import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  Comment: { type: String, required: true },
}, { timestamps: true }
);

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, default: 0 },
  category: {
    type: String,
    enum: ["Phones", "Watches", "Accessories", "Others"],
    required: true
  },
  coverImage: { type: String },
  images: [{ type: String }],
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
}, { timestamps: true });

const Item = mongoose.model("Item", itemSchema);
export default Item;
