import TopBar from '../components/TopBar';
import { useState } from 'react';
import { Zap, Clock, CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';

const servicesHealth = [
  { name: 'SmartBank', status: 'healthy', circuit: 'CLOSED', latency_p50: 12, latency_p95: 28, latency_p99: 45, uptime: '99.98%', requests_24h: 2100, errors_24h: 2 },
  { name: 'PasarKita', status: 'healthy', circuit: 'CLOSED', latency_p50: 28, latency_p95: 65, latency_p99: 120, uptime: '99.95%', requests_24h: 1240, errors_24h: 5 },
  { name: 'WarungPOS', status: 'healthy', circuit: 'CLOSED', latency_p50: 15, latency_p95: 32, latency_p99: 58, uptime: '99.99%', requests_24h: 890, errors_24h: 0 },
  { name: 'SupplierHub', status: 'degraded', circuit: 'HALF-OPEN', latency_p50: 450, latency_p95: 1200, latency_p99: 3500, uptime: '97.20%', requests_24h: 560, errors_24h: 42 },
  { name: 'LogistiKita', status: 'healthy', circuit: 'CLOSED', latency_p50: 22, latency_p95: 48, latency_p99: 85, uptime: '99.90%', requests_24h: 420, errors_24h: 3 },
  { name: 'UMKM Insight', status: 'healthy', circuit: 'CLOSED', latency_p50: 8, latency_p95: 18, latency_p99: 30, uptime: '100%', requests_24h: 310, errors_24h: 0 },
];

const circuitTimeline = [
  { time: '08:00', service: 'SupplierHub', event: 'CLOSED → OPEN', reason: '5x 502 berturut-turut' },
  { time: '08:01', service: 'SupplierHub', event: 'OPEN (blocking)', reason: 'Menolak semua request' },
  { time: '09:01', service: 'SupplierHub', event: 'OPEN → HALF-OPEN', reason: 'Timeout 60s tercapai' },
  { time: '09:01', service: 'SupplierHub', event: 'Probe sent', reason: '1 request dikirim' },
  { time: '09:02', service: 'SupplierHub', event: 'HALF-OPEN → OPEN', reason: 'Probe gagal (502)' },
  { time: '10:02', service: 'SupplierHub', event: 'OPEN → HALF-OPEN', reason: 'Timeout 60s tercapai' },
];

const rateLimitBuckets = [
  { user_id: 'user_102', route_class: 'transactional', remaining: 3, max: 10, cooldown_remaining: '0s' },
  { user_id: 'user_115', route_class: 'transactional', remaining: 0, max: 10, cooldown_remaining: '8s' },
  { user_id: 'user_108', route_class: 'read', remaining: 42, max: 60, cooldown_remaining: '0s' },
  { user_id: 'user_121', route_class: 'transactional', remaining: 7, max: 10, cooldown_remaining: '0s' },
  { user_id: 'user_130', route_class: 'read', remaining: 58, max: 60, cooldown_remaining: '0s' },
];

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
  const [selectedService, setSelectedService] = useState(null);

  return (
    <>
      <TopBar title="Service Health" />
      <div className="page-container">
        <div className="page-header">
          <h1>Service Health</h1>
          <p>Monitoring real-time untuk 6 layanan downstream</p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid-6-cards" style={{ marginBottom: 'var(--space-6)' }}>
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
              <button className="btn btn-sm btn-secondary"><RefreshCw size={12} /> Force Probe</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {circuitTimeline.map((event, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 'var(--space-4)', padding: 'var(--space-3) 0',
                  borderLeft: '2px solid var(--color-border)', marginLeft: 'var(--space-3)',
                  paddingLeft: 'var(--space-4)', position: 'relative'
                }}>
                  <div style={{
                    position: 'absolute', left: -5, top: 14, width: 8, height: 8,
                    borderRadius: '50%', background: event.event.includes('OPEN') ? 'var(--color-danger)' : 'var(--color-success)',
                    border: '2px solid var(--color-bg-primary)'
                  }} />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 2 }}>
                      <span className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{event.time}</span>
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
                  {rateLimitBuckets.map(b => (
                    <tr key={b.user_id + b.route_class}>
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
