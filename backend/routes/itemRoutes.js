import express from "express";
import multer from "multer";
import { addItem, getItems, getItemsByCategory } from "../controllers/itemController.js";
import { protect } from "../middlewares/authMiddleware.js";
import Item from "../models/Item.js";

const router = express.Router();

// ================= Multer Storage =================
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // save to /uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });

// ================== Item Routes ===================

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

// Get items
router.get("/", getItems);

// Get items by category
router.get("/category/:category", getItemsByCategory);

// Get latest 4 items
router.get("/latest", async (req, res) => {
    try {
        const latestItems = await Item.find().sort({ createdAt: -1 }).limit(4);
        res.json(latestItems);
    } catch (err) {
        console.error("Error fetching latest items:", err.message);
        res.status(500).json({ message: "Server error fetching latest items" });
    }
});

// Get all items ordered by newest first
router.get("/all", async (req, res) => {
    try {
        const items = await Item.find().sort({ createdAt: -1 });
        res.json(items);
    } catch (err) {
        console.error("Error fetching all items:", err.message);
        res.status(500).json({ message: "Server error fetching all items" });
    }
});

// Get reviews for an item
router.get("/:id/reviews", async (req, res) => {
    try {
        const item = await Item.findById(req.params.id).populate("reviews.user", "name");
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.json(item.reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get single item
router.get("/:id", async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Item not found" });
        res.json(item);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// ================== Add Review ===================
router.post(
    "/:id/reviews",
    protect,
    upload.array("reviewImages", 3), // allow up to 3 review images
    async (req, res) => {
        const { rating, comment } = req.body;

        try {
            const item = await Item.findById(req.params.id);
            if (!item) {
                return res.status(404).json({ message: "Item not found" });
            }

            // check if already reviewed
            const alreadyReviewed = item.reviews.find(
                (r) => r.user.toString() === req.user._id.toString()
            );
            if (alreadyReviewed) {
                return res.status(400).json({ message: "Item already reviewed" });
            }

            // collect uploaded image paths
            const reviewImages = req.files ? req.files.map(f => f.filename) : [];

            // add review
            const review = {
                user: req.user._id,
                name: req.user.name,
                rating: Number(rating),
                comment,
                images: reviewImages, // ✅ save images here
            };
            item.reviews.push(review);

            // update numReviews & average rating
            item.numReviews = item.reviews.length;
            item.rating =
                item.reviews.reduce((acc, r) => acc + r.rating, 0) / item.reviews.length;

            await item.save();

            res.status(201).json({ message: "Review added successfully" });
        } catch (err) {
            console.error(err.message);
            res.status(500).json({ message: "Server error" });
        }
    }
);

export default router;
