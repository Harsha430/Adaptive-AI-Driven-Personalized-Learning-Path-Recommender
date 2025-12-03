import { Link, NavLink } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
      <nav className="glass-panel container-pro mx-auto rounded-2xl px-6 py-3 flex items-center justify-between transition-all duration-300">
        {/* Logo Section */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-lg shadow-brand-500/20 group-hover:shadow-brand-500/40 transition-all duration-300 group-hover:-translate-y-0.5">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <div className="text-xl font-heading font-bold text-white tracking-tight group-hover:text-brand-300 transition-colors">EduFlow</div>
            <div className="text-xs font-medium text-surface-400 tracking-wide">AI Learning</div>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-1">
          {!user && (
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              Home
            </NavLink>
          )}
          
          {user ? (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Dashboard
              </NavLink>
              <NavLink to="/learning-path" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Learning
              </NavLink>
              <NavLink to="/ai-content" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                AI Studio
              </NavLink>
              <NavLink to="/analytics" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Analytics
              </NavLink>
              <NavLink to="/forum" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Forum
              </NavLink>
              <NavLink to="/mentors" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                Mentors
              </NavLink>
              
              <div className="h-6 w-px bg-white/10 mx-3"></div>
              
              <NavLink to="/profile" className="flex items-center space-x-2 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors group">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-brand-400 to-brand-600 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                  {user.email[0].toUpperCase()}
                </div>
              </NavLink>
              
              <button onClick={logout} className="ml-2 text-sm font-medium text-surface-400 hover:text-accent-rose transition-colors">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <div className="h-6 w-px bg-white/10 mx-3"></div>
              <NavLink to="/login" className="nav-link">
                Sign In
              </NavLink>
              <NavLink to="/register" className="ml-2 btn-primary text-sm px-5 py-2">
                Get Started
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
