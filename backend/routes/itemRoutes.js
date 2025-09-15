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
        { name: "images" },
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

// Get all reviews across all items
router.get("/reviews/all", async (req, res) => {
    try {
        const items = await Item.find().select("reviews title coverImage");
        const reviews = items.flatMap((item) =>
            item.reviews.map((r) => ({
                ...r.toObject(),
                itemId: item._id,
                itemTitle: item.title,
                coverImage: item.coverImage,
            }))
        );
        res.json(reviews);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


// Delete item
router.delete("/:id", protect, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }

        await item.deleteOne();
        res.json({ message: "Item deleted successfully" });
    } catch (err) {
        console.error("Error deleting item:", err.message);
        res.status(500).json({ message: "Server error deleting item" });
    }
});

// Update item (with optional images)
router.put("/:id", upload.fields([{ name: "coverImage" }, { name: "images" }]), async (req, res) => {
    try {
        const { title, description, category, price, deletedImages, deleteCover } = req.body;
        const item = await Item.findById(req.params.id);

        item.title = title;
        item.description = description;
        item.category = category;
        item.price = price;

        // Delete cover if requested
        if (deleteCover === "true") {
            if (item.coverImage) fs.unlinkSync(path.join("uploads", item.coverImage));
            item.coverImage = "";
        }

        // New cover image
        if (req.files.coverImage) {
            item.coverImage = req.files.coverImage[0].path;
        }

        // Delete selected gallery images
        if (deletedImages) {
            const toDelete = JSON.parse(deletedImages);
            item.images = item.images.filter(img => !toDelete.includes(img));
            toDelete.forEach(img => fs.unlinkSync(path.join("uploads", img)));
        }

        // Add new images
        if (req.files.images) {
            req.files.images.forEach(file => item.images.push(file.path));
        }

        await item.save();
        res.json({ message: "Item updated", item });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/top/rated", async (req, res) => {
    try {
        const topRated = await Item.find().sort({ rating: -1 }).limit(4);
        res.json(topRated);
    } catch (err) {
        console.error("Error fetching top rated items:", err.message);
        res.status(500).json({ message: "Server error fetching top rated items" });
    }
});

router.get("/top/rated/all", async (req, res) => {
    try {
        const items = await Item.find().sort({ averageRating: -1 }).exec();
        res.json(items);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
