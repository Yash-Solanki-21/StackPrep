import { useState } from "react";
import CodingPage from "../components/Coding/CodingPage.jsx"
import ProblemPage from "../components/Coding/ProblemPage.jsx"

export default function CodingPracticePage() {

  const [selectedProblem, setSelectedProblem] = useState(null);

  return (
    <>
      {selectedProblem ? (
        <CodingPage
          problem={selectedProblem}
          onBack={() => setSelectedProblem(null)}
        />
      ) : (
        <ProblemPage
          onSelectProblem={setSelectedProblem}
        />
      )}
    </>
  );
}