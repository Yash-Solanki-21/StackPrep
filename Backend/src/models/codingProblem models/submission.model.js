import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  problemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CodingProblem",
    required: true
  },

  code: {
    type: String,
    required: true
  },

  language: {
    type: String,
    default: "javascript"
  },

  status: {
    type: String,
    enum: [
      "Accepted",
      "Wrong Answer",
      "Pending"
    ],
    default: "Pending"
  },

  passedTestCases: {
    type: Number,
    default: 0
  },

  totalTestCases: {
    type: Number,
    default: 0
  }

}, {
  timestamps: true
});

const Submission = mongoose.model("Submission",submissionSchema);

export default Submission;
