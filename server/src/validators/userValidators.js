import { body } from "express-validator";

export const updateRoleValidator = [
  body("role").isIn(["admin", "member"]).withMessage("Invalid role"),
];
