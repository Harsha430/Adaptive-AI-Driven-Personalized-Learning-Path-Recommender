import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <div className="min-h-screen pt-32 pb-12 px-6 flex items-center justify-center">
      <div className="glass-card p-8 text-center max-w-md w-full">
        <h1 className="text-3xl font-heading font-bold text-white mb-2">Page Not Found</h1>
        <p className="text-surface-300 mb-6">The page you are looking for doesn’t exist.</p>
        <Link to="/" className="btn-primary inline-block">Go Home</Link>
      </div>
    </div>
  )
}

export default NotFound


