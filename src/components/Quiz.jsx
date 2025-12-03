import { useState, useEffect } from "react";
import axios from "axios";

function Quiz({ moduleId, moduleName, onClose, onComplete }) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token && moduleId) {
      axios
        .get(`http://localhost:5000/api/quiz/module/${moduleId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setQuiz(response.data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching quiz:", error);
          setLoading(false);
        });
    }
  }, [moduleId]);

  const handleAnswerSelect = (questionIndex, answer) => {
    setSelectedAnswers({ ...selectedAnswers, [questionIndex]: answer });
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    const token = localStorage.getItem("authToken");
    let score = 0;

    // Calculate score
    quiz.questions.forEach((question, index) => {
      if (selectedAnswers[index] === question.correctAnswer) {
        score++;
      }
    });

    try {
      const response = await axios.post(
        "http://localhost:5000/api/quiz/submit",
        {
          moduleId,
          answers: selectedAnswers,
          score,
          totalQuestions: quiz.questions.length,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setResults({
        score,
        totalQuestions: quiz.questions.length,
        percentage: response.data.percentage,
        xpAwarded: response.data.xpAwarded,
      });
      setSubmitted(true);
      onComplete && onComplete(response.data);
    } catch (error) {
      console.error("Error submitting quiz:", error);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading quiz questions...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="text-center">
            <p className="text-red-600">
              Failed to load quiz. Please try again.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted && results) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Quiz Complete!
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
              <p className="text-lg font-semibold text-green-800">
                Score: {results.score}/{results.totalQuestions} (
                {results.percentage}%)
              </p>
              <p className="text-green-600 mt-2">
                🎉 You earned {results.xpAwarded} XP points!
              </p>
            </div>

            {results.percentage >= 80 && (
              <div className="text-green-600 mb-4">
                <p className="font-semibold">Excellent work! 🌟</p>
                <p>You've mastered this topic!</p>
              </div>
            )}

            {results.percentage >= 60 && results.percentage < 80 && (
              <div className="text-yellow-600 mb-4">
                <p className="font-semibold">Good job! 👍</p>
                <p>You have a solid understanding.</p>
              </div>
            )}

            {results.percentage < 60 && (
              <div className="text-orange-600 mb-4">
                <p className="font-semibold">Keep practicing! 📚</p>
                <p>Consider reviewing the module content.</p>
              </div>
            )}

            <button
              onClick={onClose}
              className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Close Quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const allAnswered = quiz.questions.every(
    (_, index) => selectedAnswers[index]
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            Quiz: {moduleName}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="mb-4">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span>
              {Object.keys(selectedAnswers).length}/{quiz.questions.length}{" "}
              answered
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full"
              style={{
                width: `${
                  ((currentQuestion + 1) / quiz.questions.length) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">{question.question}</h3>
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedAnswers[currentQuestion] === option
                    ? "border-indigo-500 bg-indigo-50"
                    : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={option}
                  checked={selectedAnswers[currentQuestion] === option}
                  onChange={() => handleAnswerSelect(currentQuestion, option)}
                  className="mr-3 text-indigo-600"
                />
                <span className="text-gray-700">{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex space-x-2">
            {currentQuestion < quiz.questions.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>

        {!allAnswered && currentQuestion === quiz.questions.length - 1 && (
          <p className="text-sm text-orange-600 mt-2 text-center">
            Please answer all questions before submitting.
          </p>
        )}
      </div>
    </div>
  );
}

export default Quiz;
