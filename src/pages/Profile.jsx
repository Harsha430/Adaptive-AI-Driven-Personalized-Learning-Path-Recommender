import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../components/ToastProvider.jsx";
import { useAuth } from "../components/AuthContext.jsx";

function Profile() {
  const { user } = useAuth();
  const { push } = useToast();
  const [skills, setSkills] = useState("");
  const [goals, setGoals] = useState("");
  const [loading, setLoading] = useState(false);
  const [pathPreview, setPathPreview] = useState(null);
  const [apiConnected, setApiConnected] = useState(null);

  useEffect(() => {
    loadUserProfile();
    checkApiConnection();
  }, []);

  async function loadUserProfile() {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get("http://localhost:5000/api/profile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.skills) {
        setSkills(res.data.skills.join(", "));
      }
      if (res.data.goals) {
        setGoals(res.data.goals.join(", "));
      }
    } catch (e) {
      console.log("No existing profile data");
    }
  }

  async function checkApiConnection() {
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get("http://localhost:5000/api/status", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApiConnected(res.data.apiConnected);
    } catch (e) {
      setApiConnected(false);
    }
  }

  async function saveProfile() {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        "http://localhost:5000/api/profile",
        {
          skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
          goals: goals.split(",").map((g) => g.trim()).filter(Boolean),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      push({ type: "success", message: "Profile updated" });
      return res.data;
    } catch (e) {
      push({ type: "error", message: "Failed to save profile" });
    } finally {
      setLoading(false);
    }
  }

  async function generatePath() {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const res = await axios.post(
        "http://localhost:5000/api/learning-path/generate",
        { goal: goals.split(",")[0] || "" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setPathPreview(res.data);
      push({ type: "success", message: "Learning path generated" });
    } catch (e) {
      push({ type: "error", message: "Failed to generate path" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="container-pro mx-auto space-y-8">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-3">Your Profile</h1>
          <p className="text-surface-300 mb-6">Tell us your skills and goals. We’ll personalize your path.</p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-sm font-medium text-surface-300 mb-2 block">Skills (comma-separated)</label>
              <input
                className="input-field"
                placeholder="JavaScript, HTML, CSS"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-surface-300 mb-2 block">Goals (comma-separated)</label>
              <input
                className="input-field"
                placeholder="Front-end Developer"
                value={goals}
                onChange={(e) => setGoals(e.target.value)}
              />
            </div>
          </div>
        <div className="flex justify-between items-center mt-6">
          <div className="flex gap-4">
            <button className="btn-outline" disabled={loading} onClick={saveProfile}>Save</button>
            <button className="btn-primary" disabled={loading} onClick={generatePath}>Generate Path</button>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${apiConnected === true ? 'bg-green-500' : apiConnected === false ? 'bg-red-500' : 'bg-gray-400'}`}></div>
            <span className="text-body-small">
              {apiConnected === true ? 'AI Connected' : apiConnected === false ? 'AI Disconnected' : 'Checking...'}
            </span>
          </div>
        </div>
        
        {apiConnected === false && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 text-yellow-600">⚠️</div>
              <span className="text-body-small text-yellow-800">
                AI features are limited. Learning paths will use basic templates instead of personalized AI generation.
              </span>
            </div>
          </div>
        )}
      </div>

      {pathPreview && (
        <div className="pro-card-elevated p-8">
          <h2 className="text-heading-4 mb-4">Generated Learning Path</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pathPreview.modules?.map((m) => (
              <div key={m._id || m.title} className="pro-card p-4">
                <div className="text-heading-4 mb-2">{m.title}</div>
                <div className="text-body">{m.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
  );
}

export default Profile;


