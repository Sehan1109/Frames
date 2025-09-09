import User from "../models/User.js";
import jwt from "jsonwebtoken";

const ADMIN_EMAIL = "sehanmindula119@gmail.com";

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("_id name email"); // 👈 fetch full user
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    req.isAdmin = user.email === ADMIN_EMAIL;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
