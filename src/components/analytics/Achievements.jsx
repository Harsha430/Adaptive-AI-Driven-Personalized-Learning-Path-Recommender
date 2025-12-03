function Achievements({ items = [] }) {
  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-medium text-white mb-3">Achievements</h3>
      <ul className="space-y-3">
        {items.map((a, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <span className="mt-0.5">🏅</span>
            <div>
              <div className="text-sm font-medium text-white">{a.title}</div>
              <div className="text-sm text-gray-400">{a.desc}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default Achievements


