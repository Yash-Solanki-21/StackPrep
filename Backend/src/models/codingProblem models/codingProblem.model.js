import mongoose from "mongoose";

const exampleSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true
    },

    output: {
        type: String,
        required: true
    },

    explanation: {
        type: String
    }
});

const testCaseSchema = new mongoose.Schema({
    input: {
        type: String,
        required: true
    },

    expectedOutput: {
        type: String,
        required: true
    }
});

const codingProblemSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        required: true
    },

    difficulty: {
        type: String,
        enum: ["Easy", "Medium", "Hard"],
        default: "Easy"
    },

    tags: [{
        type: String
    }],

    hints: [{
        type: String
    }],

    examples: [exampleSchema],

    testCases: [testCaseSchema],

    starterCode: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

const CodingProblem = mongoose.model("CodingProblem",codingProblemSchema);

export default CodingProblem;