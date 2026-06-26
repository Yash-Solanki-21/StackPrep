import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"
const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://stack-prep-phi.vercel.app"
];

app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());
app.use(express.static("public"));

import authRouter from "./src/routes/auth.route.js";
import userRouter from "./src/routes/user.route.js";

app.use("/api/v1/user", authRouter);
app.use("/api/v1/user", userRouter);

import mcqRouter from "./src/routes/mcq.route.js";
app.use("/api/v1/mcq", mcqRouter);

import resumeRouter from "./src/routes/resume.route.js";
app.use("/api/v1/resume", resumeRouter);

import codingProblemRouter from "./src/routes/codingProblem router/codingProblem.route.js";
app.use("/api/v1/problems", codingProblemRouter);

import submissionRouter from "./src/routes/codingProblem router/submit.route.js";
app.use("/api/v1/submissions", submissionRouter);

export { app };


