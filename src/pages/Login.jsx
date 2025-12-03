import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../components/AuthContext.jsx";
import { useToast } from "../components/ToastProvider.jsx";
import axios from "axios";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  function validate() {
    const nextErrors = {};
    if (!email.trim()) nextErrors.email = "Email is required";
    if (!password.trim()) nextErrors.password = "Password is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  const { login } = useAuth();
  const { push } = useToast();

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    axios
      .post("http://localhost:5000/api/login", { email, password })
      .then((response) => {
        const token = response.data.token;
        localStorage.setItem("authToken", token);

        // Update the auth context with the user info
        const result = login(email, password);
        if (result.ok) {
          push({ type: "success", message: "Login successful" });
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        setErrors({ form: error.response?.data?.error || "Login failed" });
        push({
          type: "error",
          message: error.response?.data?.error || "Login failed",
        });
      });
  }

  return (
    <div className="h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-md glass-card p-8 relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-surface-300">Sign in to continue your learning journey</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.form && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {errors.form}
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-surface-300 ml-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              placeholder="name@example.com"
            />
            {errors.email && <p className="text-xs text-red-400 ml-1">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-surface-300 ml-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-xs text-red-400 ml-1">{errors.password}</p>}
          </div>

          <button type="submit" className="w-full btn-primary">
            Sign In
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-surface-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-brand-400 hover:text-brand-300 font-medium transition-colors">
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
