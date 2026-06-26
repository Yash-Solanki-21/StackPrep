import Result from "../../models/MCQ models/mcq.result.model.js";
import MCQ from "../../models/MCQ models/mcq.model.js";
import { generateMCQService } from "../../services/ai.service.js";

const generateMCQ = async (req, res) => {
  try {
    const {
      topics,
      difficulty,
      totalQuestions
    } = req.body;

    if (
      !topics ||
      !Array.isArray(topics) ||
      topics.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select at least one topic"
      });
    }
    if (!totalQuestions) {
      return res.status(400).json({
        success: false,
        message: "Total questions required"
      });
    }
    const mcqs = await generateMCQService({
      topics,
      difficulty,
      totalQuestions
    });
    return res.status(200).json({
      success: true,
      count: mcqs.length,
      mcqs
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const submitTest = async (req, res) => {
  try {
    const { score,
      totalQuestions,
      percentage,
      topic, 
    } = req.body;

    const result = await Result.create({
      userId: req.user._id,
      topic,
      score,
      totalQuestions,
      percentage,
    });

    return res.status(200).json({
      message: "Result submitted successfully",
      result,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyResults = async (req, res) => {
  try {
    const results = await Result.find({
      userId: req.user._id,
    }).sort({createdAt: -1})
      .limit(5)

    return res.status(200).json({ tests: results });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export { generateMCQ, submitTest, getMyResults };
