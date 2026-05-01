import { Task } from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const userFilter =
    req.user.role === "admin" ? {} : { assignee: req.user._id };
  const [total, todo, inProgress, done, overdue] = await Promise.all([
    Task.countDocuments(userFilter),
    Task.countDocuments({ ...userFilter, status: "todo" }),
    Task.countDocuments({ ...userFilter, status: "in_progress" }),
    Task.countDocuments({ ...userFilter, status: "done" }),
    Task.countDocuments({
      ...userFilter,
      dueDate: { $lt: new Date() },
      status: { $ne: "done" },
    }),
  ]);

  return res.json({
    totals: { total, todo, inProgress, done, overdue },
  });
});
