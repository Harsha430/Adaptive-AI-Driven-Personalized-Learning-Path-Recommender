import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import ProgressChart from "../components/analytics/ProgressChart.jsx";
import QuizPerformanceChart from "../components/analytics/QuizPerformanceChart.jsx";
import XPCard from "../components/analytics/XPCard.jsx";
import Achievements from "../components/analytics/Achievements.jsx";

function Analytics() {
  const [analyticsData, setAnalyticsData] = useState({
    overallProgress: 0,
    quizScores: [],
    xpPoints: 0,
    streakDays: 0,
    achievements: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) return;
    axios
      .get("http://localhost:5000/api/progress", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setAnalyticsData({
          overallProgress: response.data.overallProgress,
          quizScores: response.data.quizScores,
          xpPoints: response.data.xpPoints,
          streakDays: response.data.streakDays,
          achievements: response.data.achievements || [],
        });
      })
      .catch((error) => {
        console.error("Error fetching analytics data:", error);
      });
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="container-pro mx-auto space-y-8">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div>
            <h1 className="text-3xl font-heading font-bold text-white mb-2">
              Your Learning <span className="text-gradient-primary">Analytics</span>
            </h1>
            <p className="text-surface-300">
              Track your growth, performance, and achievements in real-time.
            </p>
          </div>
          <Link
            to="/dashboard"
            className="btn-secondary text-sm"
          >
            Back to Dashboard
          </Link>
        </motion.section>

        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="glass-card p-6 h-full">
              <h3 className="text-lg font-heading font-bold text-white mb-6">Overall Progress</h3>
              <ProgressChart value={analyticsData.overallProgress} />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <XPCard
              xp={analyticsData.xpPoints}
              streak={analyticsData.streakDays}
            />
            <Achievements items={analyticsData.achievements} />
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-heading font-bold text-white mb-6">Quiz Performance History</h3>
          <QuizPerformanceChart data={analyticsData.quizScores} />
        </motion.section>
      </div>
    </div>
  );
}

export default Analytics;
