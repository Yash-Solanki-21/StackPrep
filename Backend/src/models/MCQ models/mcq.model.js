import mongoose from "mongoose";

const mcqSchema = new mongoose.Schema(
    {
        question: {
            type: String,
            required: true
        },
        options: {
            type: [String],
            required: true,
        },
        correctAnswer: {
            type: Number,
            required: true
        },
        topic: {
            type: String,
            required: true
        },
        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Easy"
        }
}, { timestamps: true}
)

const MCQ = new mongoose.model("MCQ", mcqSchema)

export default MCQ