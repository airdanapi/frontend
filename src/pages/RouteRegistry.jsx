import { useState } from 'react';
import TopBar from '../components/TopBar';
import { Plus, Edit3, X, ToggleLeft, ToggleRight } from 'lucide-react';

const services = ['SmartBank', 'PasarKita', 'WarungPOS', 'SupplierHub', 'LogistiKita', 'UMKM Insight'];

const mockRoutes = [
  { id: 1, service: 'SmartBank', feature: 'pembayaran_transaksi', method: 'POST', path: '/smartbank/pembayaran_transaksi', downstream: 'http://smartbank:8001/api/payment', transactional: true, timeout: 5000, retries: 0, active: true },
  { id: 2, service: 'SmartBank', feature: 'manajemen_saldo', method: 'GET', path: '/smartbank/manajemen_saldo', downstream: 'http://smartbank:8001/api/balance', transactional: false, timeout: 3000, retries: 1, active: true },
  { id: 3, service: 'PasarKita', feature: 'checkout', method: 'POST', path: '/marketplace/checkout', downstream: 'http://pasarkita:8002/api/checkout', transactional: true, timeout: 5000, retries: 0, active: true },
  { id: 4, service: 'PasarKita', feature: 'browsing_produk', method: 'GET', path: '/marketplace/products', downstream: 'http://pasarkita:8002/api/products', transactional: false, timeout: 3000, retries: 2, active: true },
  { id: 5, service: 'WarungPOS', feature: 'pay', method: 'POST', path: '/pos/pay', downstream: 'http://warungpos:8003/api/pay', transactional: true, timeout: 5000, retries: 0, active: true },
  { id: 6, service: 'SupplierHub', feature: 'order_bahan', method: 'POST', path: '/supplier/order', downstream: 'http://supplierhub:8004/api/order', transactional: true, timeout: 5000, retries: 0, active: true },
  { id: 7, service: 'SupplierHub', feature: 'pay', method: 'POST', path: '/supplier/pay', downstream: 'http://supplierhub:8004/api/pay', transactional: true, timeout: 5000, retries: 0, active: false },
  { id: 8, service: 'LogistiKita', feature: 'pay', method: 'POST', path: '/logistics/pay', downstream: 'http://logistikita:8005/api/pay', transactional: true, timeout: 5000, retries: 0, active: true },
  { id: 9, service: 'LogistiKita', feature: 'status', method: 'GET', path: '/logistics/status', downstream: 'http://logistikita:8005/api/status', transactional: false, timeout: 3000, retries: 1, active: true },
  { id: 10, service: 'UMKM Insight', feature: 'dashboard', method: 'GET', path: '/analytics/dashboard', downstream: 'http://umkminsight:8006/api/dashboard', transactional: false, timeout: 3000, retries: 2, active: true },
];

export default function RouteRegistry() {
  const [activeTab, setActiveTab] = useState('SmartBank');
  const [editRoute, setEditRoute] = useState(null);
  const filtered = mockRoutes.filter(r => r.service === activeTab);

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

        <div className="tab-strip">
          {services.map(s => (
            <button key={s} className={`tab-item ${activeTab === s ? 'active' : ''}`} onClick={() => setActiveTab(s)}>
              {s}
              <span style={{ marginLeft: 6, fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>
                ({mockRoutes.filter(r => r.service === s).length})
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
              {filtered.map(route => (
                <tr key={route.id}>
                  <td style={{ fontWeight: 500 }}>{route.feature}</td>
                  <td><span className={`badge ${route.method === 'POST' ? 'badge-primary' : 'badge-info'}`}>{route.method}</span></td>
                  <td className="mono">{route.path}</td>
                  <td className="mono" style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis' }}>{route.downstream}</td>
                  <td>{route.transactional ? <span className="badge badge-monetary">FEE 0.5%</span> : <span className="badge badge-info">READ</span>}</td>
                  <td className="mono">{route.timeout}ms</td>
                  <td className="mono">{route.retries}</td>
                  <td>
                    {route.active ? (
                      <span style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: 4 }}><ToggleRight size={18} /> Active</span>
                    ) : (
                      <span style={{ color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}><ToggleLeft size={18} /> Disabled</span>
                    )}
                  </td>
                  <td><button className="btn btn-sm btn-ghost" onClick={() => setEditRoute(route)}><Edit3 size={14} /></button></td>
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
                {[
                  ['Feature Name', editRoute.feature],
                  ['Method', editRoute.method],
                  ['Gateway Path', editRoute.path],
                  ['Downstream URL', editRoute.downstream],
                  ['Timeout (ms)', editRoute.timeout],
                  ['Max Retries', editRoute.retries],
                ].map(([label, value]) => (
                  <div className="form-group" key={label}>
                    <label className="form-label">{label}</label>
                    <input className="input" defaultValue={value} />
                  </div>
                ))}
                <div className="form-group">
                  <label className="form-label">Transactional (Fee 0.5%)</label>
                  <select className="input" defaultValue={editRoute.transactional ? 'true' : 'false'}>
                    <option value="true">Yes — Fee dipungut</option>
                    <option value="false">No — Read only</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
                  <button className="btn btn-primary" style={{ flex: 1 }}>Save Changes</button>
                  <button className="btn btn-secondary" onClick={() => setEditRoute(null)}>Cancel</button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}
