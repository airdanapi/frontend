import './HowItWorks.css';

const steps = [
  {
    num: '01',
    color: '#6366f1',
    title: 'Connect Your APIs',
    desc: 'Add any REST, GraphQL, or gRPC API in seconds. Use our pre-built connectors for 500+ popular services or bring your own.',
    code: `// Add your API endpoint
api.register({
  name: 'my-service',
  baseUrl: 'https://api.example.com',
  auth: 'bearer'
})`,
  },
  {
    num: '02',
    color: '#a855f7',
    title: 'Configure & Transform',
    desc: 'Map fields, transform payloads, and set up authentication rules with an intuitive visual builder — or use code.',
    code: `// Transform response data
.transform(res => ({
  id:    res.data.userId,
  name:  res.data.fullName,
  score: res.meta.rating * 10
}))`,
  },
  {
    num: '03',
    color: '#06b6d4',
    title: 'Deploy & Monitor',
    desc: 'Go live with one click. Monitor every call in real-time with latency graphs, error rates, and custom dashboards.',
    code: `// Deploy to production
await api.deploy('production')
// ✓ Deployed in 1.2s
// ✓ Health check passed
// ✓ Monitoring active`,
  },
];

const HowItWorks = () => {
  return (
    <section className="section hiw" id="how-it-works">
      <div className="container">
        <div className="hiw__header">
          <p className="section-label">How It Works</p>
          <h2 className="section-title">
            From zero to production in{' '}
            <span className="text-gradient">3 simple steps</span>
          </h2>
          <p className="section-desc">
            No DevOps degree required. AirdanAPI abstracts away infrastructure
            complexity so your team ships faster.
          </p>
        </div>

        <div className="hiw__steps">
          {steps.map((step, i) => (
            <div key={step.num} className="hiw__step">
              {/* Connector line */}
              {i < steps.length - 1 && <div className="hiw__connector" />}

              <div className="hiw__step-left">
                <div className="hiw__num" style={{ '--c': step.color }}>
                  <span>{step.num}</span>
                </div>
                <div className="hiw__step-body">
                  <h3 className="hiw__step-title">{step.title}</h3>
                  <p className="hiw__step-desc">{step.desc}</p>
                </div>
              </div>

              <div className="hiw__step-right">
                <div className="hiw__code-block" style={{ '--c': step.color }}>
                  <div className="hiw__code-header">
                    <div className="hiw__code-dots">
                      <span /><span /><span />
                    </div>
                    <span className="hiw__code-lang">javascript</span>
                  </div>
                  <pre className="hiw__code-body">
                    <code>{step.code}</code>
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
