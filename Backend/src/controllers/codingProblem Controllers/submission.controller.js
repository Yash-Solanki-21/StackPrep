import Submission from "../../models/codingProblem models/submission.model.js";

const submitSolution = async (req, res) => {
try {
    const { problemId, code, language  } = req.body;

    if (!problemId || !code) {
        return res.status(400).json({
            message: "Problem ID and Code are required"
        });
    }

    const submission =
        await Submission.create({
            userId: req.user._id,
            problemId,
            code,
            language,
            status: "Accepted"
        });

    return res.status(201).json({
        message: "Solution submitted successfully",
        submission
    });

} catch (error) {
    console.error("SUBMIT ERROR:", error);
    return res.status(500).json({
        message: error.message
    });

}
};

const getMySubmissions = async (req, res) => {
  try {

    const solved = await Submission.find({
      userId: req.user._id,
      status: "Accepted"
    }).populate("problemId", "difficulty");

    const uniqueProblems = new Map();

    solved.forEach((s) => {
      uniqueProblems.set(
        s.problemId._id.toString(),
        s.problemId
      );
    });

    const problems = [...uniqueProblems.values()];

    const easy = problems.filter(
      p => p.difficulty === "Easy"
    ).length;

    const medium = problems.filter(
      p => p.difficulty === "Medium"
    ).length;

    const hard = problems.filter(
      p => p.difficulty === "Hard"
    ).length;

    return res.json({
      totalSolved: problems.length,
      easy,
      medium,
      hard
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
};

export { submitSolution, getMySubmissions };
