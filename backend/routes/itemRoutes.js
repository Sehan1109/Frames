import express from "express";
import multer from "multer";
import { addItem, getItems } from "../controllers/itemController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

// Use multer middleware to handle file uploads
router.post("/", protect, upload.single("image"), addItem);

router.get("/", getItems);
router.post("/", protect, addItem);

export default router;
