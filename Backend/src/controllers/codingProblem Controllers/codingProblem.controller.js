import CodingProblem from "../../models/codingProblem models/codingProblem.model.js"
import axios from "axios"

const createProblem = async (req,res) => {
    try {
        const {title,description,difficulty,tags,hints,
            examples, testCases,starterCode } = req.body;

        if (!title ||!description ) {
            return res.status(400).json({
                    message:"Title and Description are required"
                });
        }
        const problem = await CodingProblem.create({
                title,description,difficulty,tags,hints,
                examples,testCases,starterCode});

        return res.status(201).json({
                message:"Problem created successfully",
                problem
            });
    } catch (error) {
        return res.status(500).json({
                message: error.message
            });
    }
};

const getAllProblems = async (req, res) => {

    try {
        const problems = await CodingProblem.find();
        return res.status(200).json(problems);

    } catch (error) {
        return res.status(500).json({
                message:  error.message
            });
    }
};

const getProblemStats = async (req, res) => {
  try {
    const totalQuestions = await CodingProblem.countDocuments();

    const easyQuestions = await CodingProblem.countDocuments({
      difficulty: "Easy",
    });

    const mediumQuestions = await CodingProblem.countDocuments({
      difficulty: "Medium",
    });

    const hardQuestions = await CodingProblem.countDocuments({
      difficulty: "Hard",
    });

    return res.status(200).json({
      totalQuestions,
      easyQuestions,
      mediumQuestions,
      hardQuestions,
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

const getProblemById = async (req, res) => {

    try {
        const { id } =   req.params;
        const problem = await CodingProblem.findById(id);

        if (!problem) {
            return res.status(404).json({
                    message: "Problem not found"
                });
        }
        return res.status(200).json(problem);

    } catch (error) {
        return res.status(500).json({
                message: error.message
            });
    }
};

const deleteProblem = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedProblem = await CodingProblem.findByIdAndDelete(id);

    if (!deletedProblem) {
      return res.status(404).json({
        message: "Problem not found"
      });
    }

    return res.status(200).json({
      message: "Problem deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

const runCode = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const problem = await CodingProblem.findById(problemId);
    if (!problem) {
      return res.status(404).json({
        message: "Problem not found"
      });
    }
    const result = await axios.post(
      "https://emkc.org/api/v2/piston/execute",
      {
        language: "javascript",
        version: "18.15.0",
        files: [
          {
            content: code
          }
        ]
      }
    );
    return res.status(200).json(result.data);
  } catch (error) {
    console.log("RUN CODE ERROR:", error);
    return res.status(500).json({
      message: error.message
    });
  }
};

export {
    createProblem,
    getAllProblems,
    getProblemStats,
    getProblemById,
    deleteProblem,
    runCode
};