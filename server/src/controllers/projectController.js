import { Project } from "../models/Project.js";
import { User } from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const listProjects = asyncHandler(async (req, res) => {
  const query =
    req.user.role === "admin"
      ? {}
      : {
          $or: [
            { owner: req.user._id },
            { members: { $elemMatch: { user: req.user._id } } },
          ],
        };

  const projects = await Project.find(query)
    .populate("owner", "name email")
    .populate("members.user", "name email")
    .sort({ createdAt: -1 });

  return res.json({ projects });
});

export const getProject = asyncHandler(async (req, res) => {
  return res.json({ project: req.project });
});

export const createProject = asyncHandler(async (req, res) => {
  const { name, description, startDate, dueDate } = req.body;

  const project = await Project.create({
    name,
    description,
    startDate,
    dueDate,
    owner: req.user._id,
    members: [{ user: req.user._id, role: "owner" }],
  });

  return res.status(201).json({ project });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = req.project;
  Object.assign(project, req.body);
  await project.save();
  return res.json({ project });
});

export const addMember = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;

  const project = req.project;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const exists = project.members.some(
    (member) => member.user.toString() === userId,
  );
  if (exists) {
    return res.status(409).json({ message: "Member already exists" });
  }

  project.members.push({ user: userId, role: role || "member" });
  await project.save();

  return res.json({ project });
});

export const removeMember = asyncHandler(async (req, res) => {
  const { memberId } = req.params;

  const project = req.project;

  const isOwner = project.owner.toString() === memberId;
  if (isOwner) {
    return res.status(400).json({ message: "Owner cannot be removed" });
  }

  project.members = project.members.filter(
    (member) => member.user.toString() !== memberId,
  );
  await project.save();

  return res.json({ project });
});
