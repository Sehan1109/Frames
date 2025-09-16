import User from "../models/User.js";
import jwt from "jsonwebtoken";

const ADMIN_EMAIL = "sehanmindula119@gmail.com";

export const protect = async (req, res, next) => {
  try {
    // ✅ Check for token in headers
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Fetch user from DB
    const user = await User.findById(decoded.id).select("_id name email");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // ✅ Attach user info to request
    req.user = user;
    req.isAdmin = user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

    next();
  } catch (err) {
    console.error("❌ Auth error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};