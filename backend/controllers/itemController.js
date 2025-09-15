// controllers/itemController.js
import Item from "../models/Item.js";

export const addItem = async (req, res) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: "Only admin can add items" });
  }

  try {
    const { title, description, price, category } = req.body;

    // ✅ Save only filenames, not "uploads/filename"
    const coverImage = req.files?.coverImage
      ? req.files.coverImage[0].filename
      : null;

    const images = req.files?.images
      ? req.files.images.map((file) => file.filename)
      : [];

    const item = await Item.create({
      title,
      description,
      price,
      category,
      coverImage,
      images,
    });

    res.json({ message: "Item added successfully", item });
  } catch (err) {
    console.error("Error adding item:", err.message);
    res.status(500).json({ message: "Server error while adding item" });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("Error fetching items:", err.message);
    res.status(500).json({ message: "Server error fetching items" });
  }
};

export const getItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const items = await Item.find({ category }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("Error fetching category items:", err.message);
    res.status(500).json({ message: "Server error fetching category items" });
  }
};
