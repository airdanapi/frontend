import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import { Plus, Edit3, X, ToggleLeft, ToggleRight, AlertCircle } from 'lucide-react';
import apiService from '../services/api';
import ConfirmModal from '../components/ConfirmModal';

export default function RouteRegistry() {
  const [routes, setRoutes] = useState([]);
  const [services, setServices] = useState([]);
  const [activeTab, setActiveTab] = useState('');
  const [editRoute, setEditRoute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    setLoading(true);
    try {
      const response = await apiService.getRoutes();
      const routesData = response.data || [];
      setRoutes(routesData);
      
      // Extract unique services
      const uniqueServices = [...new Set(routesData.map(r => r.service_name))];
      setServices(uniqueServices);
      if (uniqueServices.length > 0 && !activeTab) {
        setActiveTab(uniqueServices[0]);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load routes:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRoute = async () => {
    if (!editRoute) return;
    
    try {
      await apiService.updateRoute(editRoute.id, {
        feature_name: editRoute.feature_name,
        method: editRoute.method,
        downstream_url: editRoute.downstream_url,
        timeout_ms: parseInt(editRoute.timeout_ms),
        max_retries: parseInt(editRoute.max_retries),
        is_transactional: editRoute.is_transactional,
        is_active: editRoute.is_active,
        required_scope: editRoute.required_scope
      });
      setEditRoute(null);
      loadRoutes();
    } catch (err) {
      console.error('Failed to update route:', err);
      alert('Failed to update route: ' + err.message);
    }
  };

  const handleToggleActive = (route) => {
    setConfirmAction({
      title: route.is_active ? 'Disable Route?' : 'Enable Route?',
      message: route.is_active 
        ? `Route ${route.service_name}/${route.feature_name} akan dinonaktifkan. Request akan ditolak dengan 404.`
        : `Route ${route.service_name}/${route.feature_name} akan diaktifkan kembali.`,
      onConfirm: async () => {
        try {
          await apiService.updateRoute(route.id, { is_active: !route.is_active });
          loadRoutes();
        } catch (err) {
          alert('Failed to toggle route: ' + err.message);
        }
        setShowConfirm(false);
      }
    });
    setShowConfirm(true);
  };

  const filtered = routes.filter(r => r.service_name === activeTab);

  if (loading) {
    return (
      <>
        <TopBar title="Route Registry" />
        <div className="page-container">
          <div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <TopBar title="Route Registry" />
      <div className="page-container">
        <div className="page-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1>Route Registry</h1>
              <p>Kontrak API dan mapping endpoint ke layanan downstream</p>
            </div>
            <button className="btn btn-primary"><Plus size={14} /> Add Route</button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: 'var(--space-4)' }}>
            <AlertCircle size={16} style={{ marginRight: 8 }} />
            Error loading routes: {error}
          </div>
        )}

        <div className="tab-strip">
          {services.map(s => (
            <button key={s} className={`tab-item ${activeTab === s ? 'active' : ''}`} onClick={() => setActiveTab(s)}>
              {s}
              <span style={{ marginLeft: 6, fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                ({routes.filter(r => r.service_name === s).length})
              </span>
            </button>
          ))}
        </div>

        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Feature</th><th>Method</th><th>Gateway Path</th><th>Downstream URL</th>
                <th>Transactional</th><th>Timeout</th><th>Retries</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                  No routes found for {activeTab}
                </td></tr>
              )}
              {filtered.map(route => (
                <tr key={route.id}>
                  <td style={{ fontWeight: 500 }}>{route.feature_name}</td>
                  <td><span className={`badge ${route.method === 'POST' ? 'badge-primary' : 'badge-info'}`}>{route.method}</span></td>
                  <td className="mono">/api/v1/{route.service_name}/{route.feature_name}</td>
                  <td className="mono" style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis' }}>{route.downstream_url}</td>
                  <td>{route.is_transactional ? <span className="badge badge-monetary">FEE 0.5%</span> : <span className="badge badge-info">READ</span>}</td>
                  <td className="mono">{route.timeout_ms}ms</td>
                  <td className="mono">{route.max_retries}</td>
                  <td>
                    <button 
                      onClick={() => handleToggleActive(route)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      {route.is_active ? (
                        <span style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 4 }}><ToggleRight size={18} /> Active</span>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><ToggleLeft size={18} /> Disabled</span>
                      )}
                    </button>
                  </td>
                  <td><button className="btn btn-sm btn-ghost" onClick={() => setEditRoute({...route})}><Edit3 size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Edit Drawer */}
        {editRoute && (
          <>
            <div className="drawer-overlay" onClick={() => setEditRoute(null)} />
            <div className="drawer">
              <div className="drawer-header">
                <h3 style={{ fontSize: 'var(--text-lg)', fontWeight: 700 }}>Edit Route</h3>
                <button className="btn btn-ghost" onClick={() => setEditRoute(null)}><X size={18} /></button>
              </div>
              <div className="drawer-body">
                <div className="form-group">
                  <label className="form-label">Feature Name</label>
                  <input className="input" value={editRoute.feature_name} 
                    onChange={e => setEditRoute({...editRoute, feature_name: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Method</label>
                  <select className="input" value={editRoute.method}
                    onChange={e => setEditRoute({...editRoute, method: e.target.value})}>
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Downstream URL</label>
                  <input className="input" value={editRoute.downstream_url}
                    onChange={e => setEditRoute({...editRoute, downstream_url: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Timeout (ms)</label>
                  <input className="input" type="number" value={editRoute.timeout_ms}
                    onChange={e => setEditRoute({...editRoute, timeout_ms: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Retries</label>
                  <input className="input" type="number" value={editRoute.max_retries}
                    onChange={e => setEditRoute({...editRoute, max_retries: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Transactional (Fee 0.5%)</label>
                  <select className="input" value={editRoute.is_transactional ? 'true' : 'false'}
                    onChange={e => setEditRoute({...editRoute, is_transactional: e.target.value === 'true'})}>
                    <option value="true">Yes — Fee dipungut</option>
                    <option value="false">No — Read only</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Required Scope (optional)</label>
                  <input className="input" value={editRoute.required_scope || ''}
                    onChange={e => setEditRoute({...editRoute, required_scope: e.target.value})}
                    placeholder="e.g., payment:write" />
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                  <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleSaveRoute}>Save Changes</button>
                  <button className="btn btn-secondary" onClick={() => setEditRoute(null)}>Cancel</button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Confirm Modal */}
        {showConfirm && confirmAction && (
          <ConfirmModal
            title={confirmAction.title}
            message={confirmAction.message}
            onConfirm={confirmAction.onConfirm}
            onCancel={() => setShowConfirm(false)}
          />
        )}
      </div>
    </>
  );
}
