import express from "express";
import multer from "multer";
import { addItem, getItems, getItemsByCategory } from "../controllers/itemController.js";
import { protect } from "../middlewares/authMiddleware.js";
import Item from "../models/Item.js";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save in uploads folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// Add new item (admin only)
router.post(
    "/",
    protect,
    upload.fields([
        { name: "coverImage", maxCount: 1 },
        { name: "images", maxCount: 5 },
    ]),
    addItem
);

router.get("/", getItems);
router.post("/", protect, addItem);

// Get items by category
router.get("/category/:category", getItemsByCategory);

router.get("/:id", async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


export default router;
