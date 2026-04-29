import './Features.css';

const features = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
      </svg>
    ),
    color: '#6366f1',
    glow: 'rgba(99,102,241,0.2)',
    title: 'Lightning Fast',
    desc: 'Sub-11ms average latency with globally distributed edge nodes. Your APIs respond at the speed of light.',
    tag: 'Performance',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
    color: '#10b981',
    glow: 'rgba(16,185,129,0.2)',
    title: 'Enterprise Security',
    desc: 'AES-256 encryption, OAuth 2.0, mTLS, and SOC 2 Type II compliant infrastructure protect your data.',
    tag: 'Security',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
      </svg>
    ),
    color: '#06b6d4',
    glow: 'rgba(6,182,212,0.2)',
    title: 'Real-time Analytics',
    desc: 'Live dashboards tracking every request, error, and latency spike with customizable alerting.',
    tag: 'Monitoring',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
        <path d="M6 9v6M18 9v6M9 6h6"/>
      </svg>
    ),
    color: '#a855f7',
    glow: 'rgba(168,85,247,0.2)',
    title: 'Smart Orchestration',
    desc: 'Chain multiple API calls, transform payloads, and build complex workflows with a visual editor.',
    tag: 'Automation',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
        <polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
    color: '#f59e0b',
    glow: 'rgba(245,158,11,0.2)',
    title: 'Webhook Engine',
    desc: 'Reliable webhook delivery with automatic retries, signature verification, and event replay.',
    tag: 'Webhooks',
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
    color: '#ec4899',
    glow: 'rgba(236,72,153,0.2)',
    title: 'One-Click SDKs',
    desc: 'Auto-generated, type-safe SDKs for Node.js, Python, Go, Ruby, and more. Ready to ship.',
    tag: 'Developer UX',
  },
];

const Features = () => {
  return (
    <section className="section features" id="features">
      <div className="container">
        <div className="features__header">
          <p className="section-label">Features</p>
          <h2 className="section-title">
            Everything you need to{' '}
            <span className="text-gradient">integrate APIs</span>
          </h2>
          <p className="section-desc">
            From authentication to analytics, AirdanAPI handles the complexity
            so you can focus on building great products.
          </p>
        </div>

        <div className="features__grid">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="feature-card"
              style={{ '--color': f.color, '--glow': f.glow, animationDelay: `${i * 0.1}s` }}
            >
              <div className="feature-card__icon-wrap">
                <div className="feature-card__icon" style={{ color: f.color }}>
                  {f.icon}
                </div>
              </div>
              <div className="feature-card__tag" style={{ color: f.color, background: f.glow }}>
                {f.tag}
              </div>
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__desc">{f.desc}</p>
              <div className="feature-card__arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
                Learn more
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
