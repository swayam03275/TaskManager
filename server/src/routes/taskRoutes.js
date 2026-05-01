import { Router } from "express";
import {
  createTask,
  listTasksByProject,
  updateTask,
} from "../controllers/taskController.js";
import { requireAuth } from "../middleware/auth.js";
import { ensureProjectAccess } from "../middleware/projectAccess.js";
import { ensureTaskAccess } from "../middleware/taskAccess.js";
import { validate } from "../middleware/validate.js";
import { projectIdParam } from "../validators/projectValidators.js";
import {
  createTaskValidator,
  taskIdParam,
  updateTaskValidator,
} from "../validators/taskValidators.js";

const router = Router();

router.use(requireAuth);

router.get(
  "/projects/:projectId",
  projectIdParam,
  validate,
  ensureProjectAccess,
  listTasksByProject,
);
router.post(
  "/projects/:projectId",
  projectIdParam,
  createTaskValidator,
  validate,
  ensureProjectAccess,
  createTask,
);
router.patch(
  "/:taskId",
  taskIdParam,
  updateTaskValidator,
  validate,
  ensureTaskAccess,
  updateTask,
);

export default router;
