import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js";
import {
  generateMCQ,
  submitTest,
  getMyResults,
} from "../controllers/MCQ controllers/mcq.controller.js";

const mcqRouter = Router();

mcqRouter.post("/generate", generateMCQ);
mcqRouter.post("/submit-test", verifyJWT,  submitTest);
mcqRouter.get("/my-results", verifyJWT, getMyResults);

export default mcqRouter;
