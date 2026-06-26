import {Router} from "express"
import verifyJWT from "../middleware/auth.middleware.js"
import { upload } from "../middleware/multer.middleware.js"
import uploadResume from "../controllers/resume.controller.js"

const router = Router()

router.post("/upload", verifyJWT, upload.single("resume"), uploadResume)

export default router;