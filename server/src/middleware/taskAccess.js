import { Project } from "../models/Project.js";
import { Task } from "../models/Task.js";

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

export const ensureTaskAccess = async (req, res, next) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (!isMember(project, req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    req.task = task;
    req.project = project;
    return next();
  } catch (error) {
    return next(error);
  }
};
