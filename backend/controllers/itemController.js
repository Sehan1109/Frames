import Item from "../models/Item.js";

export const addItem = async (req, res) => {
  if (!req.isAdmin) {
    return res.status(403).json({ message: "Only admin can add items" });
  }

  try {
    const { title, description, imageUrl, price, category } = req.body;
    const item = await Item.create({ title, description, imageUrl, price, category });
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
