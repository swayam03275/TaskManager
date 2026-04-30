import { User } from "../models/User.js";
import { verifyAccessToken } from "../utils/tokens.js";

export const requireAuth = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ message: "Missing access token" });
  }

  try {
    const decoded = verifyAccessToken(token);
    const user = await User.findById(decoded.sub).select("_id email name role");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid access token" });
  }
};
