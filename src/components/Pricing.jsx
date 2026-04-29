import { useState } from 'react';
import './Pricing.css';

const plans = [
  {
    name: 'Starter',
    price: { monthly: 0, annual: 0 },
    desc: 'Perfect for personal projects and prototypes.',
    color: '#6366f1',
    features: [
      '5 API connections',
      '10,000 requests / month',
      'Basic analytics',
      'Community support',
      'REST & GraphQL',
      '99.5% SLA',
    ],
    cta: 'Get Started Free',
    ctaStyle: 'outline',
    popular: false,
  },
  {
    name: 'Pro',
    price: { monthly: 49, annual: 39 },
    desc: 'For growing startups and development teams.',
    color: '#a855f7',
    features: [
      'Unlimited API connections',
      '2M requests / month',
      'Advanced analytics & alerts',
      'Priority email support',
      'REST, GraphQL & gRPC',
      'Webhook engine',
      '99.9% SLA',
      'Custom transformations',
    ],
    cta: 'Start Free Trial',
    ctaStyle: 'primary',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: { monthly: 199, annual: 159 },
    desc: 'For large-scale production workloads.',
    color: '#06b6d4',
    features: [
      'Unlimited everything',
      'Dedicated infrastructure',
      'Real-time dashboard',
      '24/7 dedicated support',
      'Custom SLA',
      'SSO & SAML',
      'Audit logs',
      'On-premise deployment',
    ],
    cta: 'Contact Sales',
    ctaStyle: 'outline',
    popular: false,
  },
];

const Pricing = () => {
  const [annual, setAnnual] = useState(false);

  return (
    <section className="section pricing" id="pricing">
      <div className="container">
        <div className="pricing__header">
          <p className="section-label">Pricing</p>
          <h2 className="section-title">
            Simple, transparent{' '}
            <span className="text-gradient">pricing</span>
          </h2>
          <p className="section-desc">
            Start free. Scale as you grow. No hidden fees, no surprises.
          </p>

          {/* Toggle */}
          <div className="pricing__toggle">
            <span className={!annual ? 'active' : ''}>Monthly</span>
            <button
              className={`toggle-btn ${annual ? 'toggle-btn--on' : ''}`}
              onClick={() => setAnnual(!annual)}
              aria-label="Toggle annual billing"
            >
              <span className="toggle-thumb" />
            </button>
            <span className={annual ? 'active' : ''}>
              Annual
              <span className="pricing__save">Save 20%</span>
            </span>
          </div>
        </div>

        <div className="pricing__grid">
          {plans.map(plan => (
            <div
              key={plan.name}
              className={`pricing-card ${plan.popular ? 'pricing-card--popular' : ''}`}
              style={{ '--c': plan.color }}
            >
              {plan.popular && (
                <div className="pricing-card__badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                  Most Popular
                </div>
              )}

              <div className="pricing-card__header">
                <h3 className="pricing-card__name" style={{ color: plan.color }}>
                  {plan.name}
                </h3>
                <p className="pricing-card__desc">{plan.desc}</p>
              </div>

              <div className="pricing-card__price">
                <span className="pricing-card__currency">$</span>
                <span className="pricing-card__amount">
                  {annual ? plan.price.annual : plan.price.monthly}
                </span>
                {plan.price.monthly > 0 && (
                  <span className="pricing-card__period">/mo</span>
                )}
                {plan.price.monthly === 0 && (
                  <span className="pricing-card__period">forever</span>
                )}
              </div>

              <a
                href="#"
                className={`btn ${plan.ctaStyle === 'primary' ? 'btn-primary' : 'btn-outline'} pricing-card__cta`}
                style={plan.ctaStyle === 'primary' ? {} : { borderColor: plan.color, color: plan.color }}
              >
                {plan.cta}
              </a>

              <div className="pricing-card__divider" />

              <ul className="pricing-card__features">
                {plan.features.map(f => (
                  <li key={f} className="pricing-card__feature">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={plan.color} strokeWidth="2.5">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="pricing__note">
          All plans include a 14-day free trial. No credit card required.
        </p>
      </div>
    </section>
  );
};

export default Pricing;
