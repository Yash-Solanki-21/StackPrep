import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

const analyzeResume = async (resumeText) => {
  const prompt = `
You are an ATS Resume Analyzer.

Analyze the resume and return ONLY JSON.

{
  "atsScore": 0,
  "strengths": [],
  "weaknesses": [],
  "missingKeywords": [],
  "suggestions": []
}

Scoring Rules:
- Skills section: 20 points
- Projects section: 25 points
- Education: 15 points
- Formatting: 15 points
- Keywords relevance: 25 points

Resume:
${resumeText}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
  });
  return response.text;
};

const generateMCQService = async ({
  topics,
  difficulty,
  totalQuestions
}) => {

  const prompt = `
Generate ${totalQuestions} multiple choice questions.

Topics:
${topics.join(", ")}

Difficulty:
${difficulty}

Return ONLY valid JSON array.

Format:

[
  {
    "question": "What is React?",
    "options": [
      "Library",
      "Framework",
      "Database",
      "Language"
    ],
    "correctAnswer": 0,
    "topic": "React",
    "difficulty": "Medium"
  }
]

Rules:
- Exactly 4 options.
- correctAnswer must be option index (0-3).
- No markdown.
- No explanation.
- Return JSON only.
`;

  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: prompt,
  });

  return response.text;
};

export {analyzeResume, generateMCQService};