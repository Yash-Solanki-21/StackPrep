import {useEffect, useState } from "react";
import Editor, {loader} from "@monaco-editor/react";
import toast from "react-hot-toast";
import "./CodeEditor.css";
import axiosInstance from "../../utils/axiosInstance";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const LANGUAGES = {
  JavaScript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function twoSum(nums, target) {
  // Write your solution here
};`,
  Python: `class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        # Write your solution here
        pass`,
  Java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your solution here
    }
}`,
  "C++": `class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
    }
};`,
};

export default function CodeEditor({problem}) {
  const [lang, setLang] = useState("JavaScript");
  const [code, setCode] = useState(LANGUAGES["JavaScript"]);
  const [theme, setTheme] = useState("github-dark");

  const [output,setOutput] = useState("");

// const handleRun = async () => {
//   try {
//     const res = await axiosInstance.post(
//       "/problems/run",
//       {
//         problemId: problem._id,
//         code,
//         language: lang
//       }
//     );
//     console.log(res.data);
//   } catch (error) {
//     console.log(error);
//   }
// };

const handleSubmit = async () => {
  try {
    const res = await axiosInstance.post(
      "/submissions/",
      {
        problemId: problem._id,
        code,
        language: lang,
      }
    );
    toast.success("Solution Submitted Successfully");
  } catch (error) {
    console.log(error);
  }
};

  useEffect(() => {
    loader.init().then((monaco) => {
        fetch(
        "https://raw.githubusercontent.com/brijeshb42/monaco-themes/master/themes/GitHub%20Dark.json"
      )
        .then((res) => res.json())
        .then((darkTheme) => {
          monaco.editor.defineTheme("github-dark", darkTheme);
          monaco.editor.defineTheme("github-light", {
          base: "vs",
          inherit: true,
          rules: [],
          colors: {},
        });
        monaco.editor.setTheme(theme);
        });
    });
  }, []);

  const handleLang = (l) => {
    setLang(l);
    setCode(LANGUAGES[l]);
  };

  const toggleTheme = () => {
  const newTheme =
    theme === "github-dark"
      ? "github-light"
      : "github-dark";

  setTheme(newTheme);

  loader.init().then((monaco) => {
    monaco.editor.setTheme(newTheme);
  });
};

  return (
    <div className="ce-wrapper">
      <div className="ce-topbar">
  <div className="ce-lang-select">
    <select
      value={lang}
      onChange={(e) => handleLang(e.target.value)}
      className="ce-dropdown"
    >
      {Object.keys(LANGUAGES).map((l) => (
        <option key={l} value={l}>{l}</option>
      ))}
    </select>
  </div>
  <div className="ce-btns">
  <button className="btn-run"
  // onClick={handleRun}
  >▶ Run</button>
  
  <button className="btn-submit"
  onClick={handleSubmit}>Submit</button>

  <button
    className="theme-btn"
    onClick={toggleTheme}
  >
    {theme === "github-dark"
      ? <MdLightMode />
      : <MdDarkMode />}
  </button>
</div>
</div>

      <div className="ce-editor">
        <Editor
          height="100%"
          language={lang === "C++" ? "cpp" : lang.toLowerCase()}
          value={code}
          onChange={(val) => setCode(val)}
          theme={theme}
          options={{
            lineHeight: 27,
            fontSize: 17,
            letterSpacing: 1.5,
            fontWeight: 200,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontFamily: "Fira Code, Consolas, monospace",
            fontLigatures: true,
            lineNumbers: "on",
            automaticLayout: true,
            padding: { top: 16 },
          }}
        />
      </div>
      
    </div>
  );
}