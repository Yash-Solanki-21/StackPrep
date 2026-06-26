import fs from "fs";
import { PDFParse } from "pdf-parse";
import { analyzeResume } from "../services/ai.service.js";

const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "Resume file is required",
      });
    }

    let resumeText = "";

    if (req.file.mimetype === "application/pdf") {
      const pdfBuffer = fs.readFileSync(req.file.path);

      const parser = new PDFParse({
        data: new Uint8Array(pdfBuffer),
      });

      const result = await parser.getText();
      resumeText = result.text; // Check actual property

    } else {
      return res.status(400).json({
        message: "Only PDF files are allowed",
      });
    }

    const analysis = await analyzeResume(resumeText);
    console.log(analysis)
    const parsed = JSON.parse(analysis.replace(/```json|```/g, "").trim());

    return res.status(200).json({
      message: "Resume analyzed successfully",
      analysis: parsed
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export default uploadResume