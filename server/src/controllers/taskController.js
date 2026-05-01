import { Task } from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listTasksByProject = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ project: req.project._id })
    .populate("assignee", "name email")
    .sort({ createdAt: -1 });

  // Add the logic where if task has assignee it is returned as "taken"
  const mappedTasks = tasks.map((task) => ({
    ...task.toObject(),
    taken: !!task.assignee, // Flag to show if task is taken
  }));

  return res.json({ tasks: mappedTasks });
});

export const createTask = asyncHandler(async (req, res) => {
  if (req.body.assignee) {
    const isOwner = req.project.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin) {
      return res
        .status(403)
        .json({ message: "Only admin or project owner can assign tasks" });
    }
  }

  const task = await Task.create({
    ...req.body,
    project: req.project._id,
    createdBy: req.user._id,
  });

  return res.status(201).json({ task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = req.task;

  // Check if there is an attempted assignee change
  if (req.body.assignee !== undefined) {
    const isOwner = req.project.owner.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      if (req.body.assignee === null) {
        return res
          .status(403)
          .json({ message: "Only admin or project owner can unassign tasks" });
      }
      if (req.body.assignee) {
        return res
          .status(403)
          .json({ message: "Only admin or project owner can assign tasks" });
      }
    }
  }

  Object.assign(task, req.body);
  await task.save();
  return res.json({ task });
});
