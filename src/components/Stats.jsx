import './Stats.css';

const stats = [
  { value: '500+', label: 'API Connectors', icon: '🔌', color: '#6366f1' },
  { value: '12K+', label: 'Developers', icon: '👩‍💻', color: '#a855f7' },
  { value: '99.99%', label: 'Uptime SLA', icon: '⚡', color: '#10b981' },
  { value: '<11ms', label: 'Avg Latency', icon: '🚀', color: '#06b6d4' },
  { value: '3B+', label: 'API Calls / Month', icon: '📡', color: '#f59e0b' },
  { value: 'SOC 2', label: 'Type II Certified', icon: '🛡️', color: '#ec4899' },
];

const Stats = () => {
  return (
    <section className="stats-section">
      <div className="stats-section__bg" />
      <div className="container">
        <div className="stats-grid">
          {stats.map(s => (
            <div key={s.label} className="stat-card" style={{ '--c': s.color }}>
              <div className="stat-card__icon">{s.icon}</div>
              <div className="stat-card__value" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="stat-card__label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
