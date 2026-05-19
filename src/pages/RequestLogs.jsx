import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import { Search, Filter, X, Clock, ArrowRight, RefreshCw } from 'lucide-react';
import apiService from '../services/api';

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
  const [logs, setLogs] = useState([]);
  const [selected, setSelected] = useState(null);
  const [filters, setFilters] = useState({ search: '', status: '', service: '', lifecycle: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    setLoading(true);
    try {
      const params = {
        limit: 100,
        ...(filters.status && { status_code: filters.status }),
        ...(filters.service && { source_app: filters.service }),
        ...(filters.lifecycle && { lifecycle: filters.lifecycle }),
      };
      const response = await apiService.getLogs(params);
      setLogs(response.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load logs:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  const handleApplyFilters = () => {
    loadLogs();
  };

  const filtered = logs.filter(log => {
    if (filters.search) {
      const search = filters.search.toLowerCase();
      return (
        log.request_id?.toLowerCase().includes(search) ||
        log.user_id?.toLowerCase().includes(search) ||
        log.source_app?.toLowerCase().includes(search)
      );
    }
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
              value={filters.search} onChange={e => handleFilterChange('search', e.target.value)} />
          </div>
          <select className="input" style={{ maxWidth: 150 }} value={filters.status} onChange={e => handleFilterChange('status', e.target.value)}>
            <option value="">All Status</option>
            <option value="200">200</option><option value="201">201</option>
            <option value="400">400</option><option value="401">401</option>
            <option value="403">403</option><option value="429">429</option>
            <option value="500">500</option><option value="502">502</option><option value="503">503</option>
          </select>
          <select className="input" style={{ maxWidth: 150 }} value={filters.service} onChange={e => handleFilterChange('service', e.target.value)}>
            <option value="">All Services</option>
            <option>PasarKita</option><option>WarungPOS</option>
            <option>SupplierHub</option><option>LogistiKita</option><option>UMKM Insight</option>
            <option>SmartBank</option>
          </select>
          <select className="input" style={{ maxWidth: 150 }} value={filters.lifecycle} onChange={e => handleFilterChange('lifecycle', e.target.value)}>
            <option value="">All Lifecycle</option>
            <option value="STARTED">STARTED</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="FAILED">FAILED</option>
          </select>
          <button className="btn btn-primary" onClick={handleApplyFilters} disabled={loading}>
            <RefreshCw size={14} style={{ marginRight: 4 }} />
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-tertiary)' }}>
            <Filter size={14} style={{ verticalAlign: 'middle', marginRight: 4 }} />{filtered.length} results
          </span>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: 'var(--space-4)' }}>
            Error loading logs: {error}
          </div>
        )}

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Time</th><th>Request ID</th><th>User</th><th>Source</th>
                <th>Endpoint</th><th>Method</th><th>Status</th><th>Latency</th><th>Lifecycle</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '40px' }}>Loading...</td></tr>
              )}
              {!loading && filtered.length === 0 && (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>No logs found</td></tr>
              )}
              {!loading && filtered.map(log => (
                <tr key={log.id || log.request_id} onClick={() => setSelected(log)} style={{ cursor: 'pointer' }}>
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
