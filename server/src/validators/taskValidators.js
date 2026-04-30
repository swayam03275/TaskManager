import { body, param } from "express-validator";
import mongoose from "mongoose";

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const taskIdParam = [
  param("taskId").custom(isObjectId).withMessage("Invalid task id"),
];

export const createTaskValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").optional().isString(),
  body("priority").optional().isIn(["low", "medium", "high"]),
  body("status").optional().isIn(["todo", "in_progress", "done"]),
  body("assignee").optional().custom(isObjectId),
  body("dueDate").optional().isISO8601().toDate(),
];

export const updateTaskValidator = [
  body("title").optional().trim().notEmpty(),
  body("description").optional().isString(),
  body("priority").optional().isIn(["low", "medium", "high"]),
  body("status").optional().isIn(["todo", "in_progress", "done"]),
  body("assignee").optional().custom(isObjectId),
  body("dueDate").optional().isISO8601().toDate(),
];
