import express from "express";
import { addItem, getItems } from "../controllers/itemController.js";
import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", getItems);
router.post("/", protect, addItem);

export default router;
