import { Router } from "express";
import verifyJWT from "../middleware/auth.middleware.js"
import getCurrentUser from "../controllers/user.controller.js"


const userRouter  = Router();

userRouter.get("/profile", verifyJWT, getCurrentUser);

export default userRouter