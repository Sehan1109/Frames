import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

connectDB();

const app = express();

// ✅ Allow frontend (Netlify) to access backend
app.use(cors({
    origin: process.env.FRONTEND_URL || "*",  // set your Netlify URL in .env for security
    credentials: true
}));

app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/payments", paymentRoutes);

// Health check route (helps debugging)
app.get("/", (req, res) => {
    res.send("Backend running on Render 🚀");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
