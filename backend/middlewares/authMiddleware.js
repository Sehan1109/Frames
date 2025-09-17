// middleware/auth.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";

const ADMIN_EMAIL = "sehanmindula119@gmail.com";

// ✅ Auth middleware
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from DB (no password)
      const user = await User.findById(decoded.id).select("_id name email");
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      req.user = user; // attach user to request
      next();
    } catch (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }
};

// ✅ Admin check middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.email === ADMIN_EMAIL) {
    next();
  } else {
    return res.status(403).json({ message: "Admin access only" });
  }
};
