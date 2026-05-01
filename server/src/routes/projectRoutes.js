import { Router } from "express";
import {
  addMember,
  createProject,
  getProject,
  listProjects,
  removeMember,
  updateProject,
} from "../controllers/projectController.js";
import { requireAuth } from "../middleware/auth.js";
import {
  ensureProjectAccess,
  ensureProjectManage,
} from "../middleware/projectAccess.js";
import { requireRole } from "../middleware/requireRole.js";
import { validate } from "../middleware/validate.js";
import {
  createProjectValidator,
  memberValidator,
  projectIdParam,
  updateProjectValidator,
} from "../validators/projectValidators.js";

const router = Router();

router.use(requireAuth);

router.get("/", listProjects);
router.post("/", createProjectValidator, validate, createProject);
router.get(
  "/:projectId",
  projectIdParam,
  validate,
  ensureProjectAccess,
  getProject,
);
router.patch(
  "/:projectId",
  projectIdParam,
  updateProjectValidator,
  validate,
  ensureProjectManage,
  updateProject,
);
router.post(
  "/:projectId/members",
  projectIdParam,
  memberValidator,
  validate,
  ensureProjectManage,
  requireRole(["admin"]),
  addMember,
);
router.delete(
  "/:projectId/members/:memberId",
  projectIdParam,
  validate,
  ensureProjectManage,
  requireRole(["admin"]),
  removeMember,
);

export default router;
