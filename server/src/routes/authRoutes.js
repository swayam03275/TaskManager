import { Router } from "express";
import {
  login,
  logout,
  me,
  refresh,
  signup,
} from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import {
  loginValidator,
  signupValidator,
} from "../validators/authValidators.js";

const router = Router();

router.post("/signup", signupValidator, validate, signup);
router.post("/login", loginValidator, validate, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", requireAuth, me);

export default router;
