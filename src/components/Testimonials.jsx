import './Testimonials.css';

const testimonials = [
  {
    name: 'Rina Kusuma',
    role: 'CTO, Tokospace',
    avatar: 'RK',
    color: '#6366f1',
    quote:
      'AirdanAPI reduced our integration time from weeks to hours. We connected 12 third-party APIs in a single afternoon. The monitoring dashboard alone is worth it.',
    rating: 5,
  },
  {
    name: 'Marcus Chen',
    role: 'Lead Engineer, Flowbit',
    avatar: 'MC',
    color: '#a855f7',
    quote:
      'The webhook engine is rock solid. We had a critical payment flow running flawlessly through AirdanAPI with zero dropped events over 6 months.',
    rating: 5,
  },
  {
    name: 'Ayu Pratiwi',
    role: 'Product Manager, DataStream',
    avatar: 'AP',
    color: '#10b981',
    quote:
      'Non-technical team members can now understand our API flows through the visual builder. It changed how we collaborate across engineering and product.',
    rating: 5,
  },
  {
    name: 'James Park',
    role: 'Founder, Launchify',
    avatar: 'JP',
    color: '#06b6d4',
    quote:
      'As a solo founder, AirdanAPI saved me from hiring a DevOps engineer. I scaled from 0 to 1M API calls/month without touching any infrastructure.',
    rating: 5,
  },
  {
    name: 'Dina Rahmat',
    role: 'Backend Lead, Kredivo',
    avatar: 'DR',
    color: '#f59e0b',
    quote:
      'The type-safe SDK generation is incredible. We went from brittle hand-rolled integrations to clean, versioned SDKs in days. Game changer for our team.',
    rating: 5,
  },
  {
    name: 'Sam Wolfe',
    role: 'DevRel, OpenCloud',
    avatar: 'SW',
    color: '#ec4899',
    quote:
      "I've tried every API gateway out there. AirdanAPI is the first one that genuinely felt like it was designed by developers, for developers.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="section testimonials">
      <div className="container">
        <div className="testimonials__header">
          <p className="section-label">Testimonials</p>
          <h2 className="section-title">
            Loved by{' '}
            <span className="text-gradient">developers worldwide</span>
          </h2>
          <p className="section-desc">
            Don't take our word for it — hear from the teams shipping
            faster with AirdanAPI.
          </p>
        </div>

        <div className="testimonials__grid">
          {testimonials.map(t => (
            <div key={t.name} className="testi-card" style={{ '--c': t.color }}>
              <div className="testi-card__quote">
                <svg width="28" height="28" viewBox="0 0 24 24" fill={t.color} opacity="0.25">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                </svg>
              </div>
              <p className="testi-card__text">{t.quote}</p>
              <div className="testi-card__stars">
                {[...Array(t.rating)].map((_, i) => (
                  <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
                  </svg>
                ))}
              </div>
              <div className="testi-card__author">
                <div className="testi-card__avatar" style={{ background: t.color }}>
                  {t.avatar}
                </div>
                <div>
                  <div className="testi-card__name">{t.name}</div>
                  <div className="testi-card__role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
