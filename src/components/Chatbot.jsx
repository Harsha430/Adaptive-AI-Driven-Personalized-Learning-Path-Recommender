import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChatBubble({ role, children }) {
  const isBot = role === "bot";
  return (
    <div className={`flex ${isBot ? "justify-start" : "justify-end"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm shadow ${
          isBot ? "bg-gray-100 text-gray-800" : "bg-indigo-600 text-white"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Chatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [step, setStep] = useState(0); // 0: init, 1: ask goal, 2: ask level, 3: generating, 4: done
  const [careerGoal, setCareerGoal] = useState("");
  const [level, setLevel] = useState("");
  const [input, setInput] = useState("");
  const viewRef = useRef(null);
  const navigate = useNavigate();

  // Auto-scroll chat to bottom when messages change
  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.scrollTop = viewRef.current.scrollHeight;
    }
  }, [messages, open]);

  // On open, start conversation
  useEffect(() => {
    if (open && messages.length === 0) {
      setTimeout(() => {
        setMessages([
          {
            role: "bot",
            text: "Hi there! 👋 I'm your AI learning assistant. I can help you build a personalized learning path. What is your main career goal? (e.g., Frontend Developer, Data Scientist)",
          },
        ]);
        setStep(1);
      }, 200);
    }
  }, [open]);

  function sendUser(text) {
    setMessages((prev) => [...prev, { role: "user", text }]);
  }

  function sendBot(text) {
    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text }]);
    }, 300);
  }

  function handleGeneratePath(goal, userLevel) {
    const token = localStorage.getItem("authToken");
    if (!token) {
      sendBot("Please log in to generate a learning path.");
      return;
    }

    setStep(3);
    sendBot("Great! I'm analyzing your profile and generating a custom learning path for you... This may take a few seconds.");

    axios
      .post(
        "http://localhost:5000/api/learning-path/generate",
        { goal, level: userLevel },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        setStep(4);
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              role: "bot",
              text: (
                <span>
                  All done! 🎉 I've created a roadmap for you.{" "}
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/learning-path");
                    }}
                    className="underline font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    View Learning Path
                  </button>
                </span>
              ),
            },
          ]);
        }, 1000);
      })
      .catch((err) => {
        console.error(err);
        setStep(1); // Reset to try again or handle differently
        sendBot("Sorry, I encountered an error generating the path. Please try again.");
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    const value = input.trim();
    if (!value) return;

    sendUser(value);
    setInput("");

    if (step === 1) {
      setCareerGoal(value);
      setStep(2);
      sendBot("Got it! And what is your current experience level? (Beginner, Intermediate, Advanced)");
      return;
    }

    if (step === 2) {
      setLevel(value);
      handleGeneratePath(careerGoal, value);
      return;
    }

    // General chat fallback
    const token = localStorage.getItem("authToken");
    if (token) {
      axios
        .post(
          "http://localhost:5000/api/chatbot",
          { message: value, context: { source: "chatbot_widget" } },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((res) => sendBot(res.data.response))
        .catch(() => sendBot("I'm having trouble connecting right now."));
    } else {
      sendBot("Please log in to chat.");
    }
  }

  function handleLevelSelect(selectedLevel) {
    sendUser(selectedLevel);
    setLevel(selectedLevel);
    handleGeneratePath(careerGoal, selectedLevel);
  }

  function resetChat() {
    setMessages([]);
    setStep(0);
    setCareerGoal("");
    setLevel("");
    setInput("");
    // Re-trigger init
    setTimeout(() => {
        setMessages([
          {
            role: "bot",
            text: "Hi there! 👋 I'm your AI learning assistant. I can help you build a personalized learning path. What is your main career goal? (e.g., Frontend Developer, Data Scientist)",
          },
        ]);
        setStep(1);
    }, 100);
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 w-80 max-w-[90vw] bg-white border shadow-xl rounded-lg overflow-hidden z-50">
          <div className="px-4 py-2 border-b bg-gray-50 flex items-center justify-between">
            <span className="text-sm font-medium">
              AI Assistant 🤖
            </span>
            <div className="flex items-center gap-2">
              <button
                className="text-xs text-indigo-600 hover:underline"
                onClick={resetChat}
              >
                Restart
              </button>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>
          </div>
          <div ref={viewRef} className="p-3 space-y-2 max-h-80 overflow-auto bg-gray-50/50">
            {messages.map((m, idx) => (
              <ChatBubble key={idx} role={m.role}>
                {m.text}
              </ChatBubble>
            ))}

            {/* Level Selection Buttons */}
            {step === 2 && (
              <div className="flex gap-2 flex-wrap mt-2">
                {["Beginner", "Intermediate", "Advanced"].map((l) => (
                  <button
                    key={l}
                    onClick={() => handleLevelSelect(l)}
                    className="text-xs bg-white border border-indigo-200 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-50 transition-colors"
                  >
                    {l}
                  </button>
                ))}
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="p-3 border-t bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full rounded-md border-gray-300 text-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              placeholder={
                step === 1
                  ? "Type your goal..."
                  : step === 2
                  ? "Type or select level..."
                  : "Type a message..."
              }
              disabled={step === 3}
            />
          </form>
        </div>
      )}
      <button
        type="button"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 flex items-center justify-center text-2xl transition-transform hover:scale-105 z-50"
        onClick={() => setOpen(!open)}
        aria-label="Open assistant"
      >
        💬
      </button>
    </>
  );
}

export default Chatbot;
