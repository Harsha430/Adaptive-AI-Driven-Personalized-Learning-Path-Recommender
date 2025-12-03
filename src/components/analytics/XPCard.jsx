function XPCard({ xp = 0, streak = 0 }) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-gray-400">XP Points</div>
          <div className="text-2xl font-semibold text-white">{xp}</div>
        </div>
        <div className="text-3xl">⚡</div>
      </div>
      <div className="mt-3 text-sm text-gray-400">Streak: <span className="font-medium text-white">{streak}</span> days</div>
    </div>
  )
}

export default XPCard


