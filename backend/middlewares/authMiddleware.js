import jwt from "jsonwebtoken";

const ADMIN_EMAIL = "sehanmindula119@gmail.com";

export const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.isAdmin = decoded.email === ADMIN_EMAIL;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
};
