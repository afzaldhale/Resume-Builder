import jwt from "jsonwebtoken";

export const adminAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const cookieToken = req.cookies?.accessToken;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : cookieToken;

    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(401).json({ message: "Admin access denied" });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
