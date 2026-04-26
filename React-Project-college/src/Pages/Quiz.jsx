import React, { useState } from "react";
import axios from "axios";

const Quiz = () => {
  const [videoLink, setVideoLink] = useState("");
  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(false);
  const [answers, setAnswers] = useState({});

  const handleGenerateQuiz = async () => {
    try {
      setLoading(true);

      const res = await axios.post("/api/transcript/quiz-from-link", {
        link: videoLink
      });

      setQuiz(res.data.quiz);
      setAnswers({});

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (qIndex, option) => {
    setAnswers({ ...answers, [qIndex]: option });
  };

  return (
    <div className="min-h-screen bg-black text-white px-6 md:px-20 py-10">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-3xl font-bold mb-6 text-center">Quiz Generator</h1>

        {/* Input */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Paste YouTube link..."
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
            className="flex-1 px-4 py-2 rounded bg-white/10 border border-white/20"
          />

          <button
            onClick={handleGenerateQuiz}
            className="bg-purple-600 px-4 py-2 rounded"
          >
            Generate
          </button>
        </div>

        {/* Loading */}
        {loading && <p>Generating quiz...</p>}

        {/* Quiz */}
        <div className="space-y-6">
          {quiz.map((q, index) => (
            <div key={index} className="bg-white/5 p-4 rounded-xl">

              <h3 className="font-semibold mb-3">
                {index + 1}. {q.question}
              </h3>

              <div className="space-y-2">
                {q.options.map((opt, i) => {
                  const isSelected = answers[index] === opt;
                  const isCorrect = q.answer === opt;

                  return (
                    <button
                      key={i}
                      onClick={() => handleSelect(index, opt)}
                      className={`block w-full text-left px-3 py-2 rounded 
                      ${isSelected ? "bg-purple-600" : "bg-gray-800"}
                      ${answers[index] && isCorrect ? "border border-green-400" : ""}
                      `}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>

              {/* Show correct */}
              {answers[index] && (
                <p className="mt-2 text-sm text-green-400">
                  Correct Answer: {q.answer}
                </p>
              )}

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default Quiz;