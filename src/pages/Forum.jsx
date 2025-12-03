import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../components/ToastProvider.jsx";

function Forum() {
  const { push } = useToast();
  const [threads, setThreads] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [activeThread, setActiveThread] = useState(null);

  const tokenHeader = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` }});

  async function loadThreads() {
    const res = await axios.get("http://localhost:5000/api/forum/threads", tokenHeader());
    setThreads(res.data);
  }

  useEffect(() => {
    loadThreads();
  }, []);

  async function createThread() {
    try {
      const res = await axios.post("http://localhost:5000/api/forum/threads", { title }, tokenHeader());
      setTitle("");
      setThreads([res.data, ...threads]);
      push({ type: "success", message: "Thread created" });
    } catch {
      push({ type: "error", message: "Failed to create thread" });
    }
  }

  async function postReply() {
    if (!activeThread) return;
    try {
      await axios.post("http://localhost:5000/api/forum/posts", { threadId: activeThread._id, content }, tokenHeader());
      setContent("");
      push({ type: "success", message: "Reply posted" });
    } catch {
      push({ type: "error", message: "Failed to post" });
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-6">
      <div className="container-pro mx-auto grid lg:grid-cols-2 gap-8">
        <div className="glass-card p-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-4">Community Forum</h1>
          <div className="flex gap-3">
            <input 
              className="input-field" 
              placeholder="Thread title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
            <button className="btn-primary whitespace-nowrap" onClick={createThread}>Create</button>
          </div>
          <div className="space-y-3 mt-6">
            {threads.map((t) => (
              <div key={t._id} className={`glass-card p-4 cursor-pointer hover:bg-surface-800/50 ${activeThread?._id === t._id ? "border-brand-500/50 bg-brand-500/10" : ""}`} onClick={() => setActiveThread(t)}>
                <div className="text-lg font-bold text-white">{t.title}</div>
                <div className="text-xs text-surface-400 mt-1">{new Date(t.createdAt).toLocaleString()} • {t.tags?.join(", ")}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-xl font-heading font-bold text-white mb-3">Reply</h2>
          <textarea 
            className="input-field min-h-[150px]" 
            placeholder="Write something helpful..." 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
          />
          <div className="mt-4">
            <button className="btn-secondary w-full" disabled={!activeThread} onClick={postReply}>Post Reply</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Forum;


