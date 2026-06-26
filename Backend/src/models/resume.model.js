import mongoose from "mongoose";


const resumeSchema = new mongoose.Schema(
    {
      userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    fileName: {
      type: String,
      required: true
    },

    atsScore: {
      type: Number,
      default: 0
    },

    skillsFound: {
      type: [String],
      default: []
    },

    missingSkills: {
      type: [String],
      default: []
    }
  },
  {
    timestamps: true
  }
  
)

const Resume = mongoose.model("Resume", resumeSchema)

export default Resume