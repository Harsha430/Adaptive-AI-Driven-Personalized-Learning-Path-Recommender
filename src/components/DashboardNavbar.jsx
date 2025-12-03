import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import { useToast } from "./ToastProvider.jsx";

function BellIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      className={props.className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}

function DashboardNavbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { push } = useToast();

  function handleLogout() {
    // Replace with real API logout later
    console.log("Logging out...");
    logout();
    push({ type: "success", message: "Logged out" });
    navigate("/login");
  }

  return (
    <header className="relative z-40">
      <nav className="glass-effect mx-4 mt-4 rounded-2xl">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 primary-gradient rounded-xl flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Adaptive Learning
              </span>
              <div className="text-sm text-white/70">Dashboard</div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              type="button"
              className="relative p-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-all duration-300"
            >
              <BellIcon className="h-6 w-6" />
              <span className="absolute -top-1 -right-1 inline-flex h-3 w-3 rounded-full bg-red-500 animate-pulse" />
            </button>

            <div className="hidden sm:flex items-center space-x-3 px-4 py-2 rounded-xl bg-white/10">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.email?.charAt(0).toUpperCase() || "U"}
                </span>
              </div>
              <span className="text-white/90 text-sm font-medium">
                {user?.email || "User"}
              </span>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default DashboardNavbar;
