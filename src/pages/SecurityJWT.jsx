import { useState } from 'react';
import TopBar from '../components/TopBar';
import ConfirmModal from '../components/ConfirmModal';
import { Key, Shield, Users, ScrollText, Plus, Trash2, RotateCcw, Copy } from 'lucide-react';

const signingKeys = [
  { kid: 'key_2026_q2', algorithm: 'RS256', status: 'ACTIVE', created: '2026-03-01', expires: '2026-06-01', rotated_by: 'admin' },
  { kid: 'key_2026_q1', algorithm: 'RS256', status: 'DEPRECATED', created: '2025-12-01', expires: '2026-03-31', rotated_by: 'admin' },
];

const blacklist = [
  { jti: 'jti_abc123def456', user_id: 'user_102', reason: 'Manual revoke - suspicious activity', revoked_at: '2026-04-29 10:30:00', expires_at: '2026-04-30 10:30:00' },
  { jti: 'jti_ghi789jkl012', user_id: 'user_115', reason: 'Password changed', revoked_at: '2026-04-28 14:15:00', expires_at: '2026-04-29 14:15:00' },
];

const roles = [
  { name: 'Operator', scopes: ['admin:read', 'admin:manage', 'logs:read'], users: 3 },
  { name: 'FinanceAuditor', scopes: ['admin:read', 'fees:read', 'fees:retry'], users: 2 },
  { name: 'AdminFull', scopes: ['admin:read', 'admin:manage', 'admin:delete', 'logs:read', 'fees:read', 'fees:retry', 'security:manage'], users: 1 },
  { name: 'ReadOnlyViewer', scopes: ['admin:read', 'logs:read'], users: 1 },
];

const auditLog = [
  { time: '2026-04-29 14:30:12', operator: 'admin', action: 'ROTATE_KEY', details: 'Rotated signing key to key_2026_q2' },
  { time: '2026-04-29 10:30:00', operator: 'admin', action: 'BLACKLIST_TOKEN', details: 'Revoked jti_abc123def456 for user_102' },
  { time: '2026-04-28 16:45:33', operator: 'auditor1', action: 'EXPORT_FEES', details: 'Exported monthly fee report for March 2026' },
  { time: '2026-04-28 14:15:00', operator: 'admin', action: 'BLACKLIST_TOKEN', details: 'Revoked jti_ghi789jkl012 for user_115' },
];

const tabs = [
  { id: 'keys', label: 'Signing Keys', icon: Key },
  { id: 'blacklist', label: 'Token Blacklist', icon: Shield },
  { id: 'roles', label: 'Scopes & Roles', icon: Users },
  { id: 'audit', label: 'Audit Log', icon: ScrollText },
];

export default function SecurityJWT() {
  const [activeTab, setActiveTab] = useState('keys');
  const [showRotateModal, setShowRotateModal] = useState(false);

  return (
    <>
      <TopBar title="Security & JWT" />
      <div className="page-container">
        <div className="page-header">
          <h1>Security & JWT</h1>
          <p>Manajemen kunci penandatanganan, token blacklist, dan kontrol akses</p>
        </div>

        <div className="tab-strip">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button key={tab.id} className={`tab-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
                <Icon size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />{tab.label}
              </button>
            );
          })}
        </div>

        {/* Signing Keys Tab */}
        {activeTab === 'keys' && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">JWT Signing Keys (RS256)</span>
              <button className="btn btn-primary" onClick={() => setShowRotateModal(true)}>
                <RotateCcw size={14} /> Rotate Key
              </button>
            </div>
            <div className="data-table-wrapper" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr><th>Key ID (kid)</th><th>Algorithm</th><th>Status</th><th>Created</th><th>Expires</th><th>Rotated By</th></tr>
                </thead>
                <tbody>
                  {signingKeys.map(k => (
                    <tr key={k.kid}>
                      <td className="mono" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                        {k.kid}
                        <button className="btn btn-ghost btn-sm" style={{ padding: 2 }}><Copy size={12} /></button>
                      </td>
                      <td className="mono">{k.algorithm}</td>
                      <td><span className={`badge ${k.status === 'ACTIVE' ? 'badge-success' : 'badge-warning'}`}>{k.status}</span></td>
                      <td className="mono">{k.created}</td>
                      <td className="mono">{k.expires}</td>
                      <td>{k.rotated_by}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-3)' }}>
              Deprecation window: 30 hari. Token yang ditandatangani dengan key DEPRECATED masih diterima hingga tanggal expires.
            </p>
          </div>
        )}

        {/* Token Blacklist Tab */}
        {activeTab === 'blacklist' && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">Token Blacklist</span>
              <button className="btn btn-secondary"><Plus size={14} /> Add to Blacklist</button>
            </div>
            <div className="data-table-wrapper" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr><th>JTI</th><th>User</th><th>Reason</th><th>Revoked At</th><th>Expires At</th><th>Action</th></tr>
                </thead>
                <tbody>
                  {blacklist.map(b => (
                    <tr key={b.jti}>
                      <td className="mono">{b.jti}</td>
                      <td className="mono">{b.user_id}</td>
                      <td style={{ maxWidth: 200, whiteSpace: 'normal', fontSize: 'var(--text-xs)' }}>{b.reason}</td>
                      <td className="mono">{b.revoked_at}</td>
                      <td className="mono">{b.expires_at}</td>
                      <td><button className="btn btn-sm btn-ghost" style={{ color: 'var(--color-danger)' }}><Trash2 size={12} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Scopes & Roles Tab */}
        {activeTab === 'roles' && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">Roles & Scopes</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {roles.map(role => (
                <div key={role.name} style={{ padding: 'var(--space-4)', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-2)' }}>
                    <span style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>{role.name}</span>
                    <span className="badge badge-info">{role.users} users</span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-1)' }}>
                    {role.scopes.map(scope => (
                      <span key={scope} className="mono" style={{
                        padding: '2px 8px', borderRadius: 'var(--radius-sm)', background: 'var(--color-bg-tertiary)',
                        fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)'
                      }}>{scope}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Audit Log Tab */}
        {activeTab === 'audit' && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">Security Audit Log</span>
            </div>
            <div className="data-table-wrapper" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr><th>Timestamp</th><th>Operator</th><th>Action</th><th>Details</th></tr>
                </thead>
                <tbody>
                  {auditLog.map((a, i) => (
                    <tr key={i}>
                      <td className="mono">{a.time}</td>
                      <td style={{ fontWeight: 500 }}>{a.operator}</td>
                      <td><span className="badge badge-primary">{a.action}</span></td>
                      <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', maxWidth: 300, whiteSpace: 'normal' }}>{a.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <ConfirmModal
          isOpen={showRotateModal}
          onClose={() => setShowRotateModal(false)}
          onConfirm={() => setShowRotateModal(false)}
          title="Rotate JWT Signing Key"
          message="Ini akan menghasilkan key baru dan menandai key saat ini sebagai DEPRECATED dengan window 30 hari. Seluruh token yang telah diterbitkan dengan key lama akan tetap valid hingga masa deprecation berakhir."
          confirmText="Rotate Key"
          danger={true}
        />
      </div>
    </>
  );
}
