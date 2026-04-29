import { useState } from 'react';
import TopBar from '../components/TopBar';
import { Search, Filter, X, Clock, ArrowRight } from 'lucide-react';

const mockLogs = Array.from({ length: 30 }, (_, i) => ({
  id: `req_${(900 - i).toString().padStart(4, '0')}`,
  request_id: `550e8400-e29b-41d4-a716-${(446655440000 + i * 111).toString()}`,
  user_id: `user_${(100 + (i % 15)).toString()}`,
  source_app: ['PasarKita', 'WarungPOS', 'SupplierHub', 'LogistiKita', 'UMKM Insight'][i % 5],
  endpoint: ['/marketplace/checkout', '/pos/pay', '/supplier/pay', '/logistics/pay', '/analytics/dashboard'][i % 5],
  method: i % 5 === 4 ? 'GET' : 'POST',
  status_code: [200, 200, 200, 401, 429, 502, 200, 200, 503, 200][i % 10],
  latency_ms: Math.floor(Math.random() * 200) + 8,
  lifecycle: [200, 200, 200, 200, 200][i % 5] === 200 ? 'COMPLETED' : 'FAILED',
  created_at: new Date(Date.now() - i * 120000).toISOString(),
}));

function statusBadge(code) {
  if (code >= 500) return <span className="badge badge-danger">{code}</span>;
  if (code >= 400) return <span className="badge badge-warning">{code}</span>;
  return <span className="badge badge-success">{code}</span>;
}

function lifecycleBadge(lc) {
  const map = { COMPLETED: 'badge-success', FAILED: 'badge-danger', STARTED: 'badge-info' };
  return <span className={`badge ${map[lc] || 'badge-info'}`}>{lc}</span>;
}

export default function RequestLogs() {
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: '', service: '' });

  const filtered = mockLogs.filter(log => {
    if (filters.search && !log.request_id.includes(filters.search) && !log.user_id.includes(filters.search)) return false;
    if (filters.status && log.status_code.toString() !== filters.status) return false;
    if (filters.service && log.source_app !== filters.service) return false;
    return true;
  });

  return (
    <>
      <TopBar title="Request Logs" />
      <div className="page-container">
        <div className="page-header">
          <h1>Request Logs</h1>
          <p>Audit trail seluruh permintaan yang melewati Gateway</p>
        </div>

        <div className="filter-bar">
          <div style={{ position: 'relative', flex: 1, maxWidth: 280 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
            <input className="input" placeholder="Search request_id, user_id..." style={{ paddingLeft: 36, maxWidth: '100%' }}
              value={filters.search} onChange={e => setFilters({ ...filters, search: e.target.value })} />
          </div>
          <select className="input" style={{ maxWidth: 150 }} value={filters.status} onChange={e => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All Status</option>
            <option value="200">200</option><option value="401">401</option>
            <option value="429">429</option><option value="502">502</option><option value="503">503</option>
          </select>
          <select className="input" style={{ maxWidth: 150 }} value={filters.service} onChange={e => setFilters({ ...filters, service: e.target.value })}>
            <option value="">All Services</option>
            <option>PasarKita</option><option>WarungPOS</option>
            <option>SupplierHub</option><option>LogistiKita</option><option>UMKM Insight</option>
          </select>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
            <Filter size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />{filtered.length} results
          </span>
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th><th>Request ID</th><th>User</th><th>Source</th>
                <th>Endpoint</th><th>Method</th><th>Status</th><th>Latency</th><th>Lifecycle</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id} onClick={() => setSelected(log)} style={{ cursor: 'pointer' }}>
                  <td className="mono">{new Date(log.created_at).toLocaleTimeString()}</td>
                  <td className="mono" style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>{log.request_id}</td>
                  <td className="mono">{log.user_id}</td>
                  <td>{log.source_app}</td>
                  <td className="mono">{log.endpoint}</td>
                  <td><span className="badge badge-info">{log.method}</span></td>
                  <td>{statusBadge(log.status_code)}</td>
                  <td className="mono">{log.latency_ms}ms</td>
                  <td>{lifecycleBadge(log.lifecycle)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detail Drawer */}
        {selected && (
          <>
            <div className="drawer-overlay" onClick={() => setSelected(null)} />
            <div className="drawer">
              <div className="drawer-header">
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Request Detail</h3>
                <button className="btn btn-ghost" onClick={() => setSelected(null)}><X size={18} /></button>
              </div>
              <div className="drawer-body">
                <div className="tab-strip">
                  <button className="tab-item active">Overview</button>
                  <button className="tab-item">Headers</button>
                  <button className="tab-item">Body</button>
                  <button className="tab-item">Trace</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                  {[
                    ['Request ID', selected.request_id, true],
                    ['User ID', selected.user_id, true],
                    ['Source App', selected.source_app],
                    ['Endpoint', selected.endpoint, true],
                    ['Method', selected.method],
                    ['Status Code', selected.status_code],
                    ['Latency', `${selected.latency_ms}ms`, true],
                    ['Lifecycle', selected.lifecycle],
                    ['Timestamp', new Date(selected.created_at).toLocaleString()],
                  ].map(([label, value, mono]) => (
                    <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border-light)' }}>
                      <span style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>{label}</span>
                      <span style={{ fontFamily: mono ? 'var(--font-mono)' : 'inherit', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>{String(value)}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 'var(--space-5)' }}>
                  <h4 style={{ fontSize: 'var(--text-md)', fontWeight: 600, marginBottom: 'var(--space-3)' }}>Trace Timeline</h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
                    <span className="badge badge-primary">{selected.source_app}</span>
                    <ArrowRight size={14} />
                    <span className="badge badge-info">Gateway</span>
                    <ArrowRight size={14} />
                    <span className="badge badge-success">SmartBank</span>
                    <Clock size={14} style={{ marginLeft: 8 }} />
                    <span className="mono">{selected.latency_ms}ms</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
