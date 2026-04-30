import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find()
    .select("_id name email role")
    .sort({ createdAt: -1 });
  return res.json({ users });
});

export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;
  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true },
  ).select("_id name email role");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json({ user });
});
