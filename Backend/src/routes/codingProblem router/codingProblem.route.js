import { Router } from "express";
import verifyJWT from "../../middleware/auth.middleware.js"
import {
  createProblem,
  getAllProblems,
  getProblemStats,
  getProblemById,
  deleteProblem,
  runCode

} from "../../controllers/codingProblem Controllers/codingProblem.controller.js";

const codingProblemRouter = Router();

codingProblemRouter.post("/", createProblem);
codingProblemRouter.get("/stats", getProblemStats);
codingProblemRouter.get("/", getAllProblems);
codingProblemRouter.delete("/:id", deleteProblem)
codingProblemRouter.get("/:id", getProblemById);

codingProblemRouter.post("/run",verifyJWT, runCode);

export default codingProblemRouter;