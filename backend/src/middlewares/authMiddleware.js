import jwt from "jsonwebtoken";

const extractToken = (req) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.split(" ")[1];
  }

  return req.cookies?.accessToken || null;
};

export const authenticate = (req, res, next) => {
  const token = extractToken(req);

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

export const authorizeSelfOrAdmin = (req, res, next) => {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const requestedUserId = Number(req.params.userId);

  if (!Number.isFinite(requestedUserId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }

  if (req.user.role === "admin" || req.user.id === requestedUserId) {
    return next();
  }

  return res.status(403).json({ message: "Forbidden" });
};

export const getAuthenticatedUser = (req, res) => {
  if (!req.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  return res.status(200).json({
    success: true,
    user: {
      id: req.user.id,
      role: req.user.role,
      name: req.user.name,
      email: req.user.email,
    },
  });
};
