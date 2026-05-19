import TopBar from '../components/TopBar';
import { useState, useEffect } from 'react';
import { Zap, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw, AlertCircle as AlertCircleIcon } from 'lucide-react';
import apiService from '../services/api';

function circuitBadge(state) {
  const map = { 'CLOSED': 'badge-success', 'OPEN': 'badge-danger', 'HALF-OPEN': 'badge-warning' };
  return <span className={`badge ${map[state]}`}>{state}</span>;
}

function statusIcon(status) {
  if (status === 'healthy') return <CheckCircle size={16} style={{ color: 'var(--color-success)' }} />;
  if (status === 'degraded') return <AlertTriangle size={16} style={{ color: 'var(--color-warning)' }} />;
  return <XCircle size={16} style={{ color: 'var(--color-danger)' }} />;
}

export default function ServiceHealth() {
  const [servicesHealth, setServicesHealth] = useState([]);
  const [circuitTimeline, setCircuitTimeline] = useState([]);
  const [rateLimitBuckets, setRateLimitBuckets] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadHealthData();
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadHealthData, 10000);
    return () => clearInterval(interval);
  }, []);

  const loadHealthData = async () => {
    try {
      const [circuitsRes, logsStatsRes] = await Promise.all([
        apiService.getCircuitStates(),
        apiService.getLogStats()
      ]);
      
      const circuits = circuitsRes.data || [];
      const logStats = logsStatsRes.data || {};
      
      // Transform circuit data to service health format
      const healthData = circuits.map(c => ({
        name: c.service_name,
        status: c.state === 'OPEN' ? 'down' : c.state === 'HALF-OPEN' ? 'degraded' : 'healthy',
        circuit: c.state,
        latency_p50: c.avg_latency_ms || 0,
        latency_p95: c.p95_latency_ms || 0,
        latency_p99: c.p99_latency_ms || 0,
        uptime: c.uptime_pct ? `${c.uptime_pct.toFixed(2)}%` : 'N/A',
        requests_24h: c.requests_24h || 0,
        errors_24h: c.errors_24h || 0
      }));
      
      setServicesHealth(healthData);
      setCircuitTimeline(logStats.circuit_events || []);
      setRateLimitBuckets(logStats.rate_limit_buckets || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load health data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForceProbe = async (serviceName) => {
    try {
      await apiService.post(`/integrator/circuits/${serviceName}/probe`);
      loadHealthData();
    } catch (err) {
      console.error('Failed to force probe:', err);
      alert('Failed to force probe: ' + err.message);
    }
  };

  if (loading) {
    return (
      <>
        <TopBar title="Service Health" />
        <div className="page-container">
          <div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Service Health" />
      <div className="page-container">
        <div className="page-header">
          <h1>Service Health</h1>
          <p>Monitoring real-time untuk layanan downstream</p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: 'var(--space-4)' }}>
            <AlertCircleIcon size={16} style={{ marginRight: 8 }} />
            Error loading health data: {error}
          </div>
        )}

        {/* Service Cards Grid */}
        <div className="grid-6-cards" style={{ marginBottom: 'var(--space-6)' }}>
          {servicesHealth.length === 0 && (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
              No services found
            </div>
          )}
          {servicesHealth.map(s => (
            <div key={s.name} className={`service-card ${s.status}`} onClick={() => setSelectedService(s)} style={{ cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                {statusIcon(s.status)}
                <span className="service-card-name" style={{ margin: 0 }}>{s.name}</span>
              </div>
              <div style={{ marginBottom: 'var(--space-2)' }}>{circuitBadge(s.circuit)}</div>
              <div className="service-card-stat"><span>p50 Latency</span><span>{s.latency_p50}ms</span></div>
              <div className="service-card-stat"><span>p95 Latency</span><span>{s.latency_p95}ms</span></div>
              <div className="service-card-stat"><span>Uptime</span><span>{s.uptime}</span></div>
              <div className="service-card-stat"><span>Requests (24h)</span><span>{s.requests_24h.toLocaleString()}</span></div>
              <div className="service-card-stat"><span>Errors (24h)</span><span style={{ color: s.errors_24h > 10 ? 'var(--color-danger)' : 'inherit' }}>{s.errors_24h}</span></div>
            </div>
          ))}
        </div>

        <div className="grid-2">
          {/* Circuit Breaker Timeline */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Circuit Breaker Timeline (24h)</span>
              <button className="btn btn-sm btn-secondary" onClick={() => handleForceProbe(selectedService?.name)}>
                <RefreshCw size={12} /> Force Probe
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {circuitTimeline.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                  No circuit breaker events in the last 24 hours
                </div>
              )}
              {circuitTimeline.map((event, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-3) 0',
                  borderLeft: '2px solid var(--color-border)', marginLeft: 'var(--space-3)',
                  paddingLeft: 'var(--space-4)', position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute', left: -5, top: 14, width: 8, height: 8,
                    borderRadius: '50%', background: event.event?.includes('OPEN') ? 'var(--color-danger)' : 'var(--color-success)',
                    border: '2px solid var(--color-bg-primary)'
                  }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
                      <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                        {new Date(event.timestamp || event.time).toLocaleTimeString()}
                      </span>
                      <span style={{ fontWeight: 600, fontSize: 'var(--text-sm)' }}>{event.event}</span>
                    </div>
                    <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>{event.reason}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rate Limit Buckets */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Rate Limit Buckets</span>
            </div>
            <div className="data-table-wrapper" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr><th>User</th><th>Class</th><th>Remaining</th><th>Cooldown</th></tr>
                </thead>
                <tbody>
                  {rateLimitBuckets.length === 0 && (
                    <tr><td colSpan="4" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                      No rate limit data available
                    </td></tr>
                  )}
                  {rateLimitBuckets.map((b, i) => (
                    <tr key={i}>
                      <td className="mono">{b.user_id}</td>
                      <td><span className={`badge ${b.route_class === 'transactional' ? 'badge-monetary' : 'badge-info'}`}>{b.route_class}</span></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                          <div style={{ width: 60, height: 6, background: 'var(--color-bg-primary)', borderRadius: 3, overflow: 'hidden' }}>
                            <div style={{
                              width: `${(b.remaining / b.max) * 100}%`, height: '100%',
                              background: b.remaining === 0 ? 'var(--color-danger)' : b.remaining < b.max * 0.3 ? 'var(--color-warning)' : 'var(--color-success)',
                              borderRadius: 3, transition: 'width 0.3s'
                            }} />
                          </div>
                          <span className="mono" style={{ fontSize: 'var(--text-xs)' }}>{b.remaining}/{b.max}</span>
                        </div>
                      </td>
                      <td className="mono" style={{ color: b.cooldown_remaining !== '0s' ? 'var(--color-warning)' : 'var(--color-text-tertiary)' }}>
                        {b.cooldown_remaining !== '0s' ? <><Clock size={12} style={{ verticalAlign: 'middle', marginRight: 4 }} />{b.cooldown_remaining}</> : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
