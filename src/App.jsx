import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import LearningPath from "./pages/LearningPath.jsx";
import Analytics from "./pages/Analytics.jsx";
import AIContentGenerator from "./pages/AIContentGenerator.jsx";
import NotFound from "./pages/NotFound.jsx";
import RequireAuth from "./components/RequireAuth.jsx";
import { ToastProvider } from "./components/ToastProvider.jsx";
import Profile from "./pages/Profile.jsx";
import Forum from "./pages/Forum.jsx";
import Mentors from "./pages/Mentors.jsx";

function AppInner() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/profile"
          element={
            <RequireAuth>
              <Profile />
            </RequireAuth>
          }
        />
        <Route
          path="/learning-path"
          element={
            <RequireAuth>
              <LearningPath />
            </RequireAuth>
          }
        />
        <Route
          path="/forum"
          element={
            <RequireAuth>
              <Forum />
            </RequireAuth>
          }
        />
        <Route
          path="/mentors"
          element={
            <RequireAuth>
              <Mentors />
            </RequireAuth>
          }
        />
        <Route
          path="/analytics"
          element={
            <RequireAuth>
              <Analytics />
            </RequireAuth>
          }
        />
        <Route
          path="/ai-content"
          element={
            <RequireAuth>
              <AIContentGenerator />
            </RequireAuth>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <Router>
          <AppInner />
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
