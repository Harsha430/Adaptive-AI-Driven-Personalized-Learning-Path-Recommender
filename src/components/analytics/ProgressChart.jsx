import { RadialBar, RadialBarChart, PolarAngleAxis, ResponsiveContainer } from 'recharts'

function ProgressChart({ value = 0 }) {
  const data = [{ name: 'Progress', value }]
  return (
    <div className="glass-card p-4">
      <h3 className="text-sm font-medium text-white mb-3">Overall Progress</h3>
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart cx="50%" cy="50%" innerRadius="70%" outerRadius="100%" barSize={14} data={data} startAngle={90} endAngle={-270}>
            <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
            <RadialBar dataKey="value" cornerRadius={14} fill="#6366f1" background />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 text-center text-lg font-semibold text-white">{value}%</div>
    </div>
  )
}

export default ProgressChart


