import './CTA.css';

const CTA = () => {
  return (
    <section className="cta-section" id="docs">
      <div className="cta-section__bg" />
      <div className="cta-section__orb cta-section__orb--1" />
      <div className="cta-section__orb cta-section__orb--2" />

      <div className="container cta-section__inner">
        <div className="cta-section__content">
          <div className="badge" style={{ margin: '0 auto 1.5rem' }}>
            <span className="badge-dot" />
            14-day free trial — No credit card
          </div>
          <h2 className="cta-section__title">
            Ready to supercharge<br />
            <span className="text-gradient">your API integrations?</span>
          </h2>
          <p className="cta-section__desc">
            Join 12,000+ developers who've already transformed the way they
            build. Start free, upgrade when you're ready.
          </p>
          <div className="cta-section__actions">
            <a href="#" className="btn btn-primary btn--lg cta-section__btn-main">
              Start Building Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#" className="btn btn-outline btn--lg">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/>
              </svg>
              Read the Docs
            </a>
          </div>

          {/* Trust badges */}
          <div className="cta-section__trust">
            {[
              { icon: '🔒', text: 'SOC 2 Type II' },
              { icon: '⚡', text: '99.99% Uptime' },
              { icon: '🌍', text: 'GDPR Compliant' },
              { icon: '🔄', text: 'Cancel Anytime' },
            ].map(item => (
              <div key={item.text} className="trust-badge">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
