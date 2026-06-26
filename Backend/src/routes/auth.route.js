import { Router } from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";
import verifyJWT from "../middleware/auth.middleware.js";
import adminMiddleware from "../middleware/Admin.middleware.js";
import { createProblem } from "../controllers/codingProblem Controllers/codingProblem.controller.js";

const router  = Router();

router.post("/register", registerUser)
router.post("/login", loginUser)
router.post("/logout", logoutUser)
router.post("/add-problem", verifyJWT,
  adminMiddleware,
  createProblem
);

export default router