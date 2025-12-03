import { useState } from "react";
import axios from "axios";

function AIContentGenerator() {
  const [topic, setTopic] = useState("");
  const [type, setType] = useState("explanation");
  const [difficulty, setDifficulty] = useState("beginner");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/generate-content",
        {
          topic: topic.trim(),
          type,
          difficulty,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setContent(response.data.content);
    } catch (error) {
      console.error("Error generating content:", error);
      setContent("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="container-pro mx-auto max-w-4xl">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-8 flex items-center gap-3">
            <span className="text-4xl">🤖</span>
            <div>
              AI Content Generator
              <span className="block text-sm font-normal text-surface-400 mt-1">
                Powered by Gemini AI
              </span>
            </div>
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">
                Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="input-field"
                placeholder="e.g., Machine Learning"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">
                Content Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="input-field"
              >
                <option value="explanation">Explanation</option>
                <option value="quiz">Quiz Questions</option>
                <option value="practice">Practice Exercises</option>
                <option value="summary">Summary</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-300 mb-2">
                Difficulty Level
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="input-field"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>

        <button
          onClick={handleGenerate}
          disabled={loading || !topic.trim()}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              <span>✨</span>
              Generate Content
            </>
          )}
        </button>

        {content && (
          <div className="mt-8">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span>📝</span>
              Generated Content
              <span className="text-sm font-normal text-gray-500">
                ({type} • {difficulty} level)
              </span>
            </h2>
            <div className="pro-card p-4 overflow-auto">
              <pre className="whitespace-pre-wrap text-sm text-white font-mono">
                {content}
              </pre>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}

export default AIContentGenerator;
