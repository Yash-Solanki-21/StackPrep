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
    // 1. Fetch all accepted submissions for the user and populate the problem details
    const acceptedSubmissions = await Submission.find({
      userId: req.user._id,
      status: "Accepted"
    }).populate("problemId", "difficulty");

    // 2. Filter out null/invalid problem entries and extract unique problem data
    const uniqueProblemsMap = new Map();
    acceptedSubmissions.forEach(sub => {
      if (sub.problemId && sub.problemId._id) {
        uniqueProblemsMap.set(sub.problemId._id.toString(), sub.problemId.difficulty);
      }
    });

    // 3. Extract unique solved IDs
    const solvedIds = Array.from(uniqueProblemsMap.keys());

    // 4. Calculate difficulty counts based on unique solved problems
    let easy = 0;
    let medium = 0;
    let hard = 0;

    uniqueProblemsMap.forEach((difficulty) => {
      if (difficulty === "Easy") easy++;
      if (difficulty === "Medium") medium++;
      if (difficulty === "Hard") hard++;
    });

    // 5. Return the exact structure expected by the frontend
    return res.json({
      solvedIds,
      totalSolved: solvedIds.length,
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
