import { Router } from "express";
import { body, param } from "express-validator";
import mongoose from "mongoose";
import { listUsers, updateUserRole } from "../controllers/userController.js";
import { requireAuth } from "../middleware/auth.js";
import { requireRole } from "../middleware/requireRole.js";
import { validate } from "../middleware/validate.js";

const router = Router();
const isObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

router.use(requireAuth);

router.get("/", listUsers);
router.patch(
  "/:userId/role",
  requireRole(["admin"]),
  [param("userId").custom(isObjectId), body("role").isIn(["admin", "member"])],
  validate,
  updateUserRole,
);

export default router;
