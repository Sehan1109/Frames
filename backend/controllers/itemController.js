import Item from "../models/Item.js";

export const addItem = async (req, res) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: "Only admin can add items" });
  }

  try {
    const { title, description, price, category } = req.body;
    const coverImage = req.files?.coverImage ? `uploads/${req.files.coverImage[0].filename}` : null;
    const images = req.files?.images ? req.files.images.map(file => `uploads/${file.filename}`) : [];

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
    res.status(500).json({ message: err.message });
  }
};

export const getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getItemsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const items = await Item.find({ category }).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
