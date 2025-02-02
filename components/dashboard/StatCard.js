function StatCard({ title, value, icon, trend, color }) {
  const colors = {
    purple: 'text-purple-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    yellow: 'text-yellow-500'
  };

  const getTrendColor = (trend) => {
    if (trend.startsWith('+')) return 'text-green-500';
    if (trend.startsWith('-')) return 'text-red-500';
    return 'text-gray-400';
  };

  return (
    <div data-name="stat-card" className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-400 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`text-2xl ${colors[color]}`}>
          <i className={`fas fa-${icon}`}></i>
        </div>
      </div>
      <div className="mt-4">
        <span className={getTrendColor(trend)}>
          <i className={`fas fa-${trend.startsWith('+') ? 'arrow-up' : 'arrow-down'} mr-1`}></i>
          {trend}
        </span>
        <span className="text-gray-400 text-sm ml-2">vs mois dernier</span>
      </div>
    </div>
  );
}
