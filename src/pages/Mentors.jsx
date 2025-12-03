import { useEffect, useState } from "react";
import axios from "axios";

function Mentors() {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    axios
      .get("http://localhost:5000/api/mentors/match", { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => setMatches(res.data || []))
      .catch(() => setMatches([]));
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="container-pro mx-auto">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-4">Mentor Matches</h1>
          {matches.length === 0 ? (
            <div className="text-surface-300">No matches yet. Add a goal in your profile.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matches.map((m) => (
                <div key={m._id} className="glass-card p-4 border border-white/5">
                  <div className="text-lg font-bold text-white mb-1">{m.email}</div>
                  <div className="text-sm text-surface-300">Goals: {m.goals?.join(", ") || "—"}</div>
                  <div className="text-sm text-surface-300">Skills: {m.skills?.join(", ") || "—"}</div>
                  <div className="text-xs text-brand-400 mt-2">XP: {m.xpPoints ?? 0}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Mentors;


