import { Task } from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listTasksByProject = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ project: req.project._id })
    .populate("assignee", "name email")
    .sort({ createdAt: -1 });
  return res.json({ tasks });
});

export const createTask = asyncHandler(async (req, res) => {
  const task = await Task.create({
    ...req.body,
    project: req.project._id,
    createdBy: req.user._id,
  });

  return res.status(201).json({ task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = req.task;
  Object.assign(task, req.body);
  await task.save();
  return res.json({ task });
});
