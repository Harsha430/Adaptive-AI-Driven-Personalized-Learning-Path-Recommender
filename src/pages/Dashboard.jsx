import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext.jsx";
import Chatbot from "../components/Chatbot.jsx";
import axios from "axios";

function Dashboard() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(0);
  const [courses, setCourses] = useState([]);
  const [milestones] = useState([
    { id: 1, label: "Finish 5 course modules", done: true },
    { id: 2, label: "Build a mini project", done: false },
    { id: 3, label: "Complete practice quiz", done: false },
  ]);
  const [xpPoints, setXpPoints] = useState(0);
  const [streakDays, setStreakDays] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      axios
        .get("http://localhost:5000/api/learning-path", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data && response.data.modules) {
            setCourses(response.data.modules);
            const completed = response.data.modules.filter((m) => m.completed).length;
            const total = response.data.modules.length;
            const calculatedProgress = total > 0 ? Math.round((completed / total) * 100) : 0;
            setProgress(calculatedProgress);
          }
        })
        .catch((error) => {
          console.error("Error fetching learning path:", error);
        });

      axios
        .get("http://localhost:5000/api/progress", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data) {
            setXpPoints(response.data.xpPoints || 0);
            setStreakDays(response.data.streakDays || 0);
          }
        })
        .catch((error) => {
          console.error("Error fetching user progress:", error);
        });

      // Ensure streak is updated for today's activity
      axios
        .post("http://localhost:5000/api/streak", {}, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          if (response.data) {
            setStreakDays(response.data.streakDays || 0);
          }
        })
        .catch((error) => {
          console.error("Error updating streak:", error);
        });

      axios
        .get("http://localhost:5000/api/leaderboard", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setLeaderboard(response.data || []);
        })
        .catch((error) => {
          console.error("Error fetching leaderboard:", error);
        });
    }
  }, [user]);

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="container-pro mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="glass-card p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-medium">
              <span className="mr-2">🎯</span> Learning Dashboard
            </div>
            
            <div className="max-w-2xl">
              <h1 className="text-4xl font-heading font-bold text-white mb-4">
                Welcome back, <span className="text-gradient-primary">{user?.name || user?.email?.split("@")[0] || "Learner"}</span>
              </h1>
              <p className="text-surface-300 text-lg leading-relaxed">
                Your personalized learning environment is ready. Track progress, 
                explore new content, and achieve your educational goals.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link to="/learning-path" className="btn-primary">
                Continue Learning
              </Link>
              <Link to="/ai-content" className="btn-secondary">
                AI Studio
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Progress Card */}
          <div className="glass-card p-6 hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-surface-200 font-medium">Progress</h3>
              <div className="w-10 h-10 rounded-xl bg-teal-500/10 flex items-center justify-center text-teal-400">
                📈
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-3xl font-heading font-bold text-white">{progress}%</span>
                <span className="text-xs font-medium text-teal-400 bg-teal-500/10 px-2 py-1 rounded-lg">On Track</span>
              </div>
              <div className="h-2 bg-surface-800 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-400 to-teal-600 rounded-full" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>

          {/* XP Card */}
          <div className="glass-card p-6 hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-surface-200 font-medium">Experience</h3>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                ⭐
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-3xl font-heading font-bold text-white">{xpPoints}</span>
                <span className="text-xs font-medium text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg">Level {Math.floor(xpPoints / 100) + 1}</span>
              </div>
              <div className="text-xs text-surface-400">
                {100 - (xpPoints % 100)} XP to next level
              </div>
            </div>
          </div>

          {/* Streak Card */}
          <div className="glass-card p-6 hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-surface-200 font-medium">Streak</h3>
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                🔥
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-3xl font-heading font-bold text-white">{streakDays}</span>
                <span className="text-xs font-medium text-rose-400 bg-rose-500/10 px-2 py-1 rounded-lg">Days</span>
              </div>
              <div className="text-xs text-surface-400 flex items-center gap-2">
                <span>{streakDays > 0 ? "Keep it up!" : "Start today!"}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <button 
                  className="text-xs px-3 py-1.5 rounded-lg bg-surface-800 hover:bg-surface-700 text-surface-300 transition-colors flex-1"
                  onClick={async () => {
                    const token = localStorage.getItem("authToken");
                    try {
                      const response = await axios.post("http://localhost:5000/api/streak", {}, {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      setStreakDays(response.data.streakDays || 0);
                    } catch (error) {
                      console.error("Manual streak update failed:", error);
                    }
                  }}
                >
                  Update
                </button>
              </div>
            </div>
          </div>

          {/* Achievements Card */}
          <div className="glass-card p-6 hover:-translate-y-1 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-surface-200 font-medium">Achievements</h3>
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
                🏆
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-3xl font-heading font-bold text-white">{milestones.filter((m) => m.done).length}</span>
                <span className="text-xs font-medium text-brand-400 bg-brand-500/10 px-2 py-1 rounded-lg">Unlocked</span>
              </div>
              <div className="text-xs text-surface-400">
                {milestones.length - milestones.filter((m) => m.done).length} more to unlock
              </div>
            </div>
          </div>
        </div>

        {/* Learning Path Modules */}
        <section className="glass-panel p-8 rounded-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-heading font-bold text-white mb-2">Your Learning Journey</h2>
              <p className="text-surface-400">Continue where you left off and explore new modules</p>
            </div>
            <Link to="/learning-path" className="btn-secondary">
              View All Modules
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses && courses.length > 0 ? (
              courses.map((c, index) => (
                <div
                  key={c.id || c._id}
                  className={`glass-card p-6 border-l-4 ${
                    c.completed ? "border-l-teal-500 bg-teal-500/5" : "border-l-brand-500"
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                      c.completed ? "bg-teal-500/20 text-teal-400" : "bg-brand-500/20 text-brand-400"
                    }`}>
                      {c.completed ? "✓" : "📚"}
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                      c.completed ? "bg-teal-500/10 text-teal-400" : "bg-brand-500/10 text-brand-400"
                    }`}>
                      {c.completed ? "Completed" : "In Progress"}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-heading font-bold text-white mb-2 line-clamp-1">{c.title}</h3>
                  <p className="text-sm text-surface-400 mb-4 line-clamp-2">{c.description}</p>
                  
                  <Link
                    to="/learning-path"
                    className={`text-sm font-bold flex items-center gap-2 ${
                      c.completed ? "text-teal-400 hover:text-teal-300" : "text-brand-400 hover:text-brand-300"
                    }`}
                  >
                    {c.completed ? "Review Module" : "Continue Learning"} 
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12 bg-surface-800/30 rounded-2xl border border-white/5">
                <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center text-3xl mx-auto mb-4 text-surface-400">
                  📚
                </div>
                <h3 className="text-xl font-heading font-bold text-white mb-2">No Learning Path Yet</h3>
                <p className="text-surface-400 mb-6">Start your journey with our AI-recommended courses!</p>
                <Link to="/learning-path" className="btn-primary">
                  Explore Courses
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Milestones & Leaderboard */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Milestones */}
          <section className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-heading font-bold text-white">Milestones</h2>
                <p className="text-sm text-surface-400">Track your achievements</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-400">
                🎯
              </div>
            </div>
            
            <div className="space-y-3">
              {milestones.map((m, index) => (
                <div
                  key={m.id}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    m.done 
                      ? "bg-teal-500/5 border-teal-500/20" 
                      : "bg-surface-800/50 border-white/5"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                      m.done ? "bg-teal-500 text-white shadow-lg shadow-teal-500/20" : "bg-surface-700 text-surface-400"
                    }`}>
                      {m.done ? "✓" : index + 1}
                    </div>
                    <span className={`text-sm font-medium ${m.done ? "text-white" : "text-surface-300"}`}>
                      {m.label}
                    </span>
                  </div>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    m.done ? "bg-teal-500/10 text-teal-400" : "bg-surface-700 text-surface-400"
                  }`}>
                    {m.done ? "Completed" : "In Progress"}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Leaderboard */}
          <section className="glass-card p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-heading font-bold text-white">Leaderboard</h2>
                <p className="text-sm text-surface-400">Top performers this month</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                🏅
              </div>
            </div>
            
            <div className="space-y-3">
              {leaderboard.length > 0 ? leaderboard.map((user, index) => (
                <div
                  key={user._id}
                  className={`flex items-center justify-between p-4 rounded-xl border ${
                    index < 3 ? "bg-surface-800/80 border-brand-500/20" : "bg-surface-800/30 border-white/5"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                      index === 0 ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" :
                      index === 1 ? "bg-slate-400 text-white" :
                      index === 2 ? "bg-orange-700 text-white" : "bg-surface-700 text-surface-400"
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{user.email.split('@')[0]}</div>
                      <div className="text-xs text-surface-400">Level {Math.floor(user.xpPoints / 100) + 1}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-brand-300">{user.xpPoints}</div>
                    <div className="text-xs text-surface-500">XP</div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <div className="w-12 h-12 rounded-xl bg-surface-800 flex items-center justify-center text-2xl mx-auto mb-4 text-surface-400">
                    👥
                  </div>
                  <p className="text-surface-400">No leaderboard data yet</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <Chatbot />
    </div>
  );
}

export default Dashboard;