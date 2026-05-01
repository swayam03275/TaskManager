import { body, param } from "express-validator";
import mongoose from "mongoose";

const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

export const projectIdParam = [
  param("projectId").custom(isObjectId).withMessage("Invalid project id"),
];

export const createProjectValidator = [
  body("name").trim().notEmpty().withMessage("Name is required"),
  body("description").optional().isString(),
  body("startDate").optional().isISO8601().toDate(),
  body("dueDate").optional().isISO8601().toDate(),
];

export const updateProjectValidator = [
  body("name").optional().trim().notEmpty(),
  body("description").optional().isString(),
  body("status").optional().isIn(["active", "archived"]),
  body("startDate").optional().isISO8601().toDate(),
  body("dueDate").optional().isISO8601().toDate(),
];

export const memberValidator = [
  body("userId").custom(isObjectId).withMessage("Invalid user id"),
  body("role").optional().isIn(["owner", "member"]),
];
