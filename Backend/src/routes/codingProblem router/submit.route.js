import { Router } from "express";
import verifyJWT from "../../middleware/auth.middleware.js";

import {
  submitSolution,
  getMySubmissions,
} from "../../controllers/codingProblem Controllers/submission.controller.js";

const submissionRouter = Router();

submissionRouter.post("/", verifyJWT, submitSolution);
submissionRouter.get("/my", verifyJWT, getMySubmissions);

export default submissionRouter;
