import React, { useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_API_KEY = "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";

const Quiz = () => {
  const [phase, setPhase] = useState("upload");
  const [pdfText, setPdfText] = useState("");
  const [fileName, setFileName] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");
  const fileRef = useRef();

  // Extract text from PDF using PDF.js
  const extractPdfText = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items.map((item) => item.str).join(" ");
      fullText += pageText + "\n";
    }

    return fullText.trim().slice(0, 6000);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== "application/pdf") {
      setError("Please upload a valid PDF file.");
      return;
    }
    setError("");
    setFileName(file.name);
    try {
      const text = await extractPdfText(file);
      setPdfText(text);
    } catch (err) {
  console.error("PDF Error:", err);
  setError("Error: " + err.message);
}
  };

  const generateQuiz = async () => {
    if (!pdfText) {
      setError("Please upload a PDF first.");
      return;
    }
    setPhase("loading");
    setError("");

    try {
      const res = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          temperature: 0.3,
          max_tokens: 3000,
          messages: [
            {
              role: "system",
              content: `You are a quiz generator. Based on the provided text, generate exactly 10 multiple choice questions.
Respond with ONLY a valid JSON array. No explanation, no markdown, no code blocks.
Format: [{"question":"...","options":["A","B","C","D"],"answer":"A"},...]
Each question must have exactly 4 options and the answer must match one of the options exactly.`,
            },
            {
              role: "user",
              content: `Generate 10 MCQ questions from this content:\n\n${pdfText}`,
            },
          ],
        }),
      });

      const data = await res.json();
      const raw = data.choices[0].message.content;
      const cleaned = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(cleaned);

      if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("Invalid quiz format received.");
      }

      setQuiz(parsed);
      setCurrent(0);
      setSelected(null);
      setAnswers([]);
      setPhase("quiz");
    } catch (err) {
      setError("Failed to generate quiz. Please try again.");
      setPhase("upload");
    }
  };

  const handleSelect = (opt) => {
    if (selected !== null) return;
    setSelected(opt);
  };

  const handleNext = () => {
    const isCorrect = selected === quiz[current].answer;
    const newAnswers = [...answers, { selected, correct: quiz[current].answer, isCorrect }];
    setAnswers(newAnswers);

    if (current + 1 >= quiz.length) {
      setPhase("result");
    } else {
      setCurrent(current + 1);
      setSelected(null);
    }
  };

  const restart = () => {
    setPhase("upload");
    setPdfText("");
    setFileName("");
    setQuiz([]);
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const score = answers.filter((a) => a.isCorrect).length;

  const getScoreColor = () => {
    const pct = score / quiz.length;
    if (pct >= 0.8) return "text-green-400";
    if (pct >= 0.5) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreMessage = () => {
    const pct = score / quiz.length;
    if (pct >= 0.9) return "Outstanding! You nailed it!";
    if (pct >= 0.7) return "Great job! Well done!";
    if (pct >= 0.5) return "Good effort! Keep studying!";
    return "Keep practicing, you'll get there!";
  };

  return (
    <div className="min-h-screen bg-black text-white">

      {/* Upload Phase */}
      {phase === "upload" && (
        <div className="flex flex-col items-center justify-center min-h-screen px-6">
          <div className="w-full max-w-lg">
            <h1 className="text-4xl font-bold text-center mb-2">PDF Quiz</h1>
            <p className="text-gray-400 text-center text-sm mb-10">
              Upload a PDF and we will generate 10 MCQ questions for you
            </p>

            <div
              onClick={() => fileRef.current.click()}
              className="border-2 border-dashed border-white/20 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-white/5 transition-all duration-200"
            >
              {fileName ? (
                <>
                  <div className="text-4xl mb-3">📄</div>
                  <p className="text-purple-400 font-medium">{fileName}</p>
                  <p className="text-gray-500 text-sm mt-1">Click to change file</p>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-3">📂</div>
                  <p className="text-white font-medium">Click to upload PDF</p>
                  <p className="text-gray-500 text-sm mt-1">Only PDF files supported</p>
                </>
              )}
            </div>

            <input
              ref={fileRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />

            {error && (
              <p className="text-red-400 text-sm text-center mt-4">{error}</p>
            )}

            <button
              onClick={generateQuiz}
              disabled={!fileName}
              className="w-full mt-6 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition-all"
            >
              Generate Quiz
            </button>
          </div>
        </div>
      )}

      {/* Loading Phase */}
      {phase === "loading" && (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 animate-pulse">Generating your quiz...</p>
        </div>
      )}

      {/* Quiz Phase */}
      {phase === "quiz" && quiz.length > 0 && (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10">
          <div className="w-full max-w-xl">

            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">
                Question {current + 1} of {quiz.length}
              </span>
              <span className="text-sm text-purple-400 font-medium">
                {Math.round(((current) / quiz.length) * 100)}% complete
              </span>
            </div>

            <div className="w-full bg-white/10 rounded-full h-1.5 mb-8">
              <div
                className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${(current / quiz.length) * 100}%` }}
              />
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <h2 className="text-lg font-semibold leading-relaxed">
                {quiz[current].question}
              </h2>
            </div>

            <div className="space-y-3 mb-6">
              {quiz[current].options.map((opt, i) => {
                const isSelected = selected === opt;
                const isCorrect = opt === quiz[current].answer;
                const showResult = selected !== null;

                let btnClass = "bg-white/5 border border-white/10 hover:bg-white/10 hover:border-purple-400";

                if (showResult) {
                  if (isCorrect) btnClass = "bg-green-500/20 border border-green-400";
                  else if (isSelected && !isCorrect) btnClass = "bg-red-500/20 border border-red-400";
                  else btnClass = "bg-white/5 border border-white/10 opacity-50";
                } else if (isSelected) {
                  btnClass = "bg-purple-600 border border-purple-400";
                }

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(opt)}
                    className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 flex items-center gap-3 ${btnClass}`}
                  >
                    <span className="text-sm font-medium text-gray-400 w-5">
                      {["A", "B", "C", "D"][i]}.
                    </span>
                    <span className="text-sm">{opt}</span>
                    {showResult && isCorrect && (
                      <span className="ml-auto text-green-400">✓</span>
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <span className="ml-auto text-red-400">✗</span>
                    )}
                  </button>
                );
              })}
            </div>

            {selected && (
              <div className={`text-sm text-center mb-4 font-medium ${selected === quiz[current].answer ? "text-green-400" : "text-red-400"}`}>
                {selected === quiz[current].answer
                  ? "Correct! Well done!"
                  : `Incorrect. The correct answer is: ${quiz[current].answer}`}
              </div>
            )}

            <button
              onClick={handleNext}
              disabled={!selected}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-30 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition-all"
            >
              {current + 1 === quiz.length ? "See Results" : "Next Question"}
            </button>
          </div>
        </div>
      )}

      {/* Result Phase */}
      {phase === "result" && (
        <div className="flex flex-col items-center justify-center min-h-screen px-6 py-10">
          <div className="w-full max-w-xl">

            <div className="text-center mb-10">
              <div className="text-6xl mb-4">
                {score / quiz.length >= 0.8 ? "🏆" : score / quiz.length >= 0.5 ? "👍" : "📚"}
              </div>
              <h1 className="text-3xl font-bold mb-2">Quiz Complete!</h1>
              <p className="text-gray-400 mb-4">{getScoreMessage()}</p>
              <div className={`text-6xl font-bold ${getScoreColor()}`}>
                {score}/{quiz.length}
              </div>
              <p className="text-gray-500 text-sm mt-2">
                {Math.round((score / quiz.length) * 100)}% correct
              </p>
            </div>

            <div className="space-y-3 mb-8">
              {quiz.map((q, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-xl border ${
                    answers[i]?.isCorrect
                      ? "bg-green-500/10 border-green-500/30"
                      : "bg-red-500/10 border-red-500/30"
                  }`}
                >
                  <span className={answers[i]?.isCorrect ? "text-green-400" : "text-red-400"}>
                    {answers[i]?.isCorrect ? "✓" : "✗"}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{q.question}</p>
                    {!answers[i]?.isCorrect && (
                      <p className="text-xs text-green-400 mt-1">
                        Correct: {q.answer}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={restart}
              className="w-full bg-purple-600 hover:bg-purple-700 py-3 rounded-xl font-semibold transition-all"
            >
              Try Another PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;