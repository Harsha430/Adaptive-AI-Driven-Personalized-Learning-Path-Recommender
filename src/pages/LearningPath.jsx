import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../components/AuthContext.jsx";
import Quiz from "../components/Quiz.jsx";
import axios from "axios";

function LearningPath() {
  const { user } = useAuth();
  const [modules, setModules] = useState([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios
        .get("http://localhost:5000/api/learning-path", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data && response.data.modules) {
            setModules(response.data.modules);
          }
        })
        .catch((error) => {
          console.error("Error fetching learning path:", error);
        });
    }
  }, []);

  const total = modules.length;
  const completedCount = useMemo(
    () => modules.filter((m) => m.completed).length,
    [modules]
  );
  const progress = total > 0 ? Math.round((completedCount / total) * 100) : 0;

  function toggleCompleted(id) {
    const token = localStorage.getItem("authToken");
    const module = modules.find((m) => (m._id || m.id) === id);

    if (!module) return;

    const newCompletedStatus = !module.completed;
    
    // Optimistically update the UI
    const updatedModules = modules.map((m) =>
      m.id === id || m._id === id ? { ...m, completed: newCompletedStatus } : m
    );
    setModules(updatedModules);

    if (token) {
      axios
        .patch(
          `http://localhost:5000/api/learning-path/module/${id}`,
          { completed: newCompletedStatus },
          { headers: { Authorization: `Bearer ${token}` } }
        )
        .then((response) => {
          if (response.data && response.data.modules) {
            const serverUpdatedModule = response.data.modules.find(
              (m) => (m._id || m.id) === id
            );
            if (serverUpdatedModule) {
              const syncedModules = modules.map((m) =>
                m.id === id || m._id === id
                  ? { ...m, completed: serverUpdatedModule.completed }
                  : m
              );
              setModules(syncedModules);

              // Update progress and stats
              const completedCount = syncedModules.filter((m) => m.completed).length;
              const overallProgress = Math.round((completedCount / syncedModules.length) * 100);

              const progressPromise = axios.post(
                "http://localhost:5000/api/progress",
                { overallProgress, quizScores: [] },
                { headers: { Authorization: `Bearer ${token}` } }
              );

              if (newCompletedStatus) {
                const xpPromise = axios.post(
                  "http://localhost:5000/api/xp",
                  { xpPoints: 50 },
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                const streakPromise = axios.post(
                  "http://localhost:5000/api/streak",
                  {},
                  { headers: { Authorization: `Bearer ${token}` } }
                );
                return Promise.all([progressPromise, xpPromise, streakPromise]);
              }
              return progressPromise;
            }
          }
        })
        .catch((error) => {
          console.error("Error updating module:", error);
          setModules(modules); // Revert on error
        });
    }
  }

  const handleTakeQuiz = (module) => {
    setSelectedModule(module);
    setShowQuiz(true);
  };

  const handleQuizClose = () => {
    setShowQuiz(false);
    setSelectedModule(null);
  };

  const handleQuizComplete = (results) => {
    console.log("Quiz completed:", results);
  };

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="container-pro mx-auto space-y-12">
        {/* Header */}
        <div className="glass-card p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-50"></div>
          <h1 className="text-4xl font-heading font-bold mb-4">
            Your Personalized <span className="text-gradient-primary">Learning Path</span>
          </h1>
          <p className="text-surface-300 max-w-2xl mx-auto text-lg">
            Based on your goals and skills, here's your recommended roadmap to success.
          </p>
        </div>

        {/* Progress Overview */}
        <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1 w-full">
            <div className="flex items-center justify-between mb-2">
              <span className="text-surface-200 font-medium">Overall Progress</span>
              <span className="text-brand-300 font-bold">{progress}%</span>
            </div>
            <div className="h-4 bg-surface-800 rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-teal-500 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-surface-400 bg-surface-800/50 px-4 py-2 rounded-xl border border-white/5">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              {completedCount} Completed
            </span>
            <span className="w-px h-4 bg-white/10"></span>
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-surface-600"></span>
              {total - completedCount} Remaining
            </span>
          </div>
        </div>

        {/* Timeline Modules */}
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-surface-700 before:to-transparent">
          {modules.length > 0 ? (
            modules.map((m, index) => (
              <div key={m.id || m._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Icon Marker */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-surface-900 bg-surface-800 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                  <span className={`text-sm ${m.completed ? "text-teal-400" : "text-surface-400"}`}>
                    {m.completed ? "✓" : index + 1}
                  </span>
                </div>
                
                {/* Content Card */}
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-card p-6 hover:border-brand-500/30 transition-all duration-300">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-heading font-bold text-white mb-2 flex items-center gap-2">
                        {m.title}
                        {m.completed && (
                          <span className="text-xs bg-teal-500/10 text-teal-400 px-2 py-0.5 rounded-full border border-teal-500/20">
                            Completed
                          </span>
                        )}
                      </h3>
                      <p className="text-surface-400 text-sm leading-relaxed">
                        {m.description}
                      </p>
                    </div>
                  </div>

                  {/* Resources */}
                  {m.resources && m.resources.length > 0 && (
                    <div className="mb-6 bg-surface-800/30 rounded-xl p-4 border border-white/5">
                      <h4 className="text-xs font-bold text-surface-500 uppercase tracking-wider mb-3">
                        Recommended Resources
                      </h4>
                      <div className="space-y-2">
                        {m.resources.map((res, idx) => (
                          <a
                            key={idx}
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group/link"
                          >
                            <span className="text-lg opacity-70 group-hover/link:opacity-100 transition-opacity">
                              {res.type === "video" ? "📺" : "📄"}
                            </span>
                            <span className="text-sm text-brand-300 group-hover/link:text-brand-200 transition-colors truncate">
                              {res.title}
                            </span>
                            <svg className="w-3 h-3 text-surface-500 ml-auto opacity-0 group-hover/link:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <label className="flex items-center gap-2 cursor-pointer group/check">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                        m.completed ? "bg-teal-500 border-teal-500" : "border-surface-600 group-hover/check:border-brand-400"
                      }`}>
                        {m.completed && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <input
                        type="checkbox"
                        checked={m.completed}
                        onChange={() => toggleCompleted(m.id || m._id)}
                        className="hidden"
                      />
                      <span className={`text-sm font-medium transition-colors ${
                        m.completed ? "text-teal-400" : "text-surface-400 group-hover/check:text-white"
                      }`}>
                        Mark as Done
                      </span>
                    </label>
                    
                    <button
                      onClick={() => handleTakeQuiz(m)}
                      className="btn-ghost text-xs py-1.5 px-3 border border-white/10 hover:border-brand-500/30 hover:bg-brand-500/10 hover:text-brand-300"
                    >
                      Take Quiz
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-surface-800/50 flex items-center justify-center text-4xl mx-auto mb-6 border border-white/5">
                🗺️
              </div>
              <h3 className="text-2xl font-heading font-bold text-white mb-3">Start Your Journey</h3>
              <p className="text-surface-400 mb-8 max-w-md mx-auto">
                Generate your personalized learning path to begin mastering new skills with AI guidance.
              </p>
              <button
                onClick={async () => {
                  try {
                    const token = localStorage.getItem("authToken");
                    await axios.post(
                      "http://localhost:5000/api/learning-path/generate",
                      {},
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    const refreshed = await axios.get(
                      "http://localhost:5000/api/learning-path",
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    if (refreshed.data && refreshed.data.modules) {
                      setModules(refreshed.data.modules);
                    }
                  } catch (e) {
                    console.error("Generate path failed", e);
                  }
                }}
                className="btn-primary"
              >
                Generate Learning Path
              </button>
            </div>
          )}
        </div>

        {/* Quiz Modal */}
        {showQuiz && selectedModule && (
          <Quiz
            moduleId={selectedModule._id || selectedModule.id}
            moduleName={selectedModule.title}
            onClose={handleQuizClose}
            onComplete={handleQuizComplete}
          />
        )}
      </div>
    </div>
  );
}

export default LearningPath;
