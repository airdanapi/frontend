import './Hero.css';

const Hero = () => {
  return (
    <section className="hero" id="home">
      {/* Animated background orbs */}
      <div className="hero__orb hero__orb--1" />
      <div className="hero__orb hero__orb--2" />
      <div className="hero__orb hero__orb--3" />

      {/* Grid overlay */}
      <div className="hero__grid" />

      <div className="container hero__inner">
        {/* Left: Content */}
        <div className="hero__content">
          <div className="badge" style={{ animationDelay: '0s' }}>
            <span className="badge-dot" />
            v2.0 — Now with AI-Powered Routing
          </div>

          <h1 className="hero__title">
            Connect Any API,{' '}
            <span className="text-gradient">Instantly &amp; Effortlessly</span>
          </h1>

          <p className="hero__desc">
            AirdanAPI is the unified integration platform that lets you connect,
            orchestrate, and monitor hundreds of APIs in minutes — no complex
            infrastructure required.
          </p>

          <div className="hero__cta">
            <a href="#" className="btn btn-primary btn--lg">
              Start Free Trial
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#how-it-works" className="btn btn-outline btn--lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="10,8 16,12 10,16"/>
              </svg>
              See How It Works
            </a>
          </div>

          {/* Social proof */}
          <div className="hero__proof">
            <div className="hero__avatars">
              {['#6366f1','#06b6d4','#a855f7','#10b981','#f59e0b'].map((c, i) => (
                <div key={i} className="hero__avatar" style={{ background: c, zIndex: 5 - i }}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div className="hero__proof-text">
              <strong>12,000+</strong> developers trust AirdanAPI
              <div className="hero__stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                ))}
                <span>4.9/5</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Code Window */}
        <div className="hero__visual animate-float">
          <div className="code-window">
            <div className="code-window__header">
              <div className="code-window__dots">
                <span style={{background:'#ff5f57'}}/>
                <span style={{background:'#febc2e'}}/>
                <span style={{background:'#28c840'}}/>
              </div>
              <span className="code-window__title">integration.js</span>
              <div className="code-window__copy">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                </svg>
              </div>
            </div>
            <div className="code-window__body">
              <pre className="code-window__code">
<span className="c-purple">import</span> <span className="c-cyan">&#123; AirdanAPI &#125;</span> <span className="c-purple">from</span> <span className="c-green">'@airdanapi/sdk'</span>
{'\n\n'}
<span className="c-comment">// Initialize once, connect anywhere</span>
{'\n'}
<span className="c-purple">const</span> <span className="c-cyan">api</span> <span className="c-white">=</span> <span className="c-purple">new</span> <span className="c-yellow">AirdanAPI</span><span className="c-white">(&#123;</span>
{'\n'}
<span className="c-white">  apiKey: </span><span className="c-green">'your-api-key'</span><span className="c-white">,</span>
{'\n'}
<span className="c-white">  region: </span><span className="c-green">'ap-southeast-1'</span>
{'\n'}
<span className="c-white">&#125;)</span>
{'\n\n'}
<span className="c-comment">// Fetch with auto-retry &amp; caching</span>
{'\n'}
<span className="c-purple">const</span> <span className="c-white">&#123; data, status &#125; =</span> <span className="c-purple">await</span>
{'\n'}
<span className="c-cyan">  api</span><span className="c-white">.</span><span className="c-yellow">connect</span><span className="c-white">(</span><span className="c-green">'stripe'</span><span className="c-white">)</span>
{'\n'}
<span className="c-cyan">     </span><span className="c-white">.</span><span className="c-yellow">get</span><span className="c-white">(</span><span className="c-green">'/v1/charges'</span><span className="c-white">)</span>
{'\n'}
<span className="c-cyan">     </span><span className="c-white">.</span><span className="c-yellow">cache</span><span className="c-white">(</span><span className="c-purple">60</span><span className="c-white">)</span>
{'\n\n'}
<span className="c-comment">// ✓ Connected in 11ms</span>
              </pre>
            </div>
            {/* Status bar */}
            <div className="code-window__status">
              <div className="status-dot" />
              <span>Connected to 3 services</span>
              <span className="status-ping">
                <span className="ping-ring" />
                Live
              </span>
            </div>
          </div>

          {/* Floating chips */}
          <div className="hero__chip hero__chip--1 animate-float-delay">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
            <span>99.9% Uptime</span>
          </div>
          <div className="hero__chip hero__chip--2 animate-float">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6366f1" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12,6 12,12 16,14"/>
            </svg>
            <span>&lt;11ms Latency</span>
          </div>
          <div className="hero__chip hero__chip--3 animate-float-delay">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Bank-grade Security</span>
          </div>
        </div>
      </div>

      {/* Trusted logos */}
      <div className="hero__logos">
        <div className="container">
          <p className="hero__logos-label">Trusted by teams at</p>
          <div className="hero__logos-row">
            {['Stripe', 'Twilio', 'Shopify', 'Notion', 'Vercel', 'Supabase'].map(name => (
              <div key={name} className="hero__logo-item">{name}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
