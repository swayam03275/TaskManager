import { Project } from "../models/Project.js";

const getMemberId = (member) => {
  if (!member?.user) {
    return null;
  }
  return member.user._id ? member.user._id.toString() : member.user.toString();
};

const isMember = (project, userId) => {
  const targetId = userId.toString();
  return (
    project.owner.toString() === targetId ||
    project.members.some((member) => getMemberId(member) === targetId)
  );
};

export const ensureProjectAccess = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId)
      .populate("owner", "name email")
      .populate("members.user", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!isMember(project, req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.project = project;
    return next();
  } catch (error) {
    return next(error);
  }
};

export const ensureProjectManage = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.owner.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.project = project;
    return next();
  } catch (error) {
    return next(error);
  }
};
