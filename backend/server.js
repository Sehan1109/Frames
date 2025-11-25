import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import path from "path"
import adminRoutes from "./routes/adminRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import adminOrderRoutes from "./routes/adminRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

connectDB();

const app = express();

const allowedOrigins = process.env.FRONTEND_URL.split(",");

app.use(
    cors({
        origin: function (origin, callback) {
            if (!origin) return callback(null, true); // mobile apps, server-to-server

            if (allowedOrigins.includes(origin)) {
                callback(null, origin); // return the same origin
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    })
);

app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/payments", paymentRoutes);

// Health check route (helps debugging)
app.get("/", (req, res) => {
    res.send("Backend running on Render 🚀");
});

app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));
app.use("/api/admin", adminRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin/orders", adminOrderRoutes);
app.use("/api/contact", contactRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));