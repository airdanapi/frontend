import { useState } from 'react';
import TopBar from '../components/TopBar';
import { User, Shield, Monitor, Bell, Palette, ScrollText, Key, Save } from 'lucide-react';

const panels = [
  { id: 'profil', label: 'Profil', icon: User },
  { id: 'keamanan', label: 'Keamanan', icon: Shield },
  { id: 'sesi', label: 'Sesi Aktif', icon: Monitor },
  { id: 'notifikasi', label: 'Notifikasi', icon: Bell },
  { id: 'tampilan', label: 'Tampilan', icon: Palette },
  { id: 'audit', label: 'Audit Aktivitas', icon: ScrollText },
  { id: 'apikeys', label: 'API Keys', icon: Key },
];

const sessions = [
  { device: 'Chrome — Windows 10', ip: '192.168.1.100', lastActive: '2 menit lalu', current: true },
  { device: 'Firefox — macOS', ip: '192.168.1.105', lastActive: '1 jam lalu', current: false },
  { device: 'Postman', ip: '10.0.0.15', lastActive: '3 jam lalu', current: false },
];

const activityLog = [
  { time: '14:30:12', action: 'Login berhasil', ip: '192.168.1.100' },
  { time: '14:28:45', action: 'Mengubah pengaturan notifikasi', ip: '192.168.1.100' },
  { time: '12:15:30', action: 'Rotate JWT key', ip: '192.168.1.100' },
  { time: '10:30:00', action: 'Blacklist token user_102', ip: '192.168.1.100' },
];

export default function SettingsPage() {
  const [activePanel, setActivePanel] = useState('profil');

  return (
    <>
      <TopBar title="Settings" />
      <div className="page-container">
        <div className="page-header">
          <h1>Settings</h1>
          <p>Pengaturan akun operator dan preferensi</p>
        </div>

        <div style={{ display: 'flex', gap: 'var(--space-5)' }}>
          {/* Sub-nav */}
          <div style={{ width: 200, flexShrink: 0 }}>
            {panels.map(p => {
              const Icon = p.icon;
              return (
                <button key={p.id} onClick={() => setActivePanel(p.id)} style={{
                  display: 'flex', alignItems: 'center', gap: 'var(--space-2)', width: '100%',
                  padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)', border: 'none',
                  background: activePanel === p.id ? 'var(--color-primary-light)' : 'transparent',
                  color: activePanel === p.id ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                  fontWeight: activePanel === p.id ? 600 : 400, cursor: 'pointer', fontSize: 'var(--text-sm)',
                  fontFamily: 'var(--font-ui)', marginBottom: 2, textAlign: 'left',
                  transition: 'all var(--transition-fast)'
                }}>
                  <Icon size={16} />{p.label}
                </button>
              );
            })}
          </div>

          {/* Panel Content */}
          <div style={{ flex: 1 }}>
            {activePanel === 'profil' && (
              <div className="card">
                <h3 className="card-title" style={{ marginBottom: 'var(--space-5)' }}>Profil Operator</h3>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nama</label>
                    <input className="input" defaultValue="Operator Admin" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="input" defaultValue="operator@gateway.local" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Role</label>
                    <input className="input" defaultValue="AdminFull" disabled style={{ opacity: 0.6 }} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Bergabung Sejak</label>
                    <input className="input" defaultValue="01 Maret 2026" disabled style={{ opacity: 0.6 }} />
                  </div>
                </div>
                <button className="btn btn-primary" style={{ marginTop: 'var(--space-3)' }}><Save size={14} /> Save</button>
              </div>
            )}

            {activePanel === 'keamanan' && (
              <div className="card">
                <h3 className="card-title" style={{ marginBottom: 'var(--space-5)' }}>Keamanan Akun</h3>
                <div className="form-group">
                  <label className="form-label">Password Lama</label>
                  <input className="input" type="password" placeholder="••••••••" />
                </div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Password Baru</label>
                    <input className="input" type="password" placeholder="••••••••" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Konfirmasi Password</label>
                    <input className="input" type="password" placeholder="••••••••" />
                  </div>
                </div>
                <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)', marginBottom: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: 'var(--text-md)' }}>Two-Factor Authentication (TOTP)</p>
                      <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>Wajib untuk peran AdminFull</p>
                    </div>
                    <span className="badge badge-success">ENABLED</span>
                  </div>
                </div>
                <button className="btn btn-primary"><Save size={14} /> Update Password</button>
              </div>
            )}

            {activePanel === 'sesi' && (
              <div className="card">
                <h3 className="card-title" style={{ marginBottom: 'var(--space-5)' }}>Sesi Aktif</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                  Session timeout: 30 menit idle, 8 jam absolute
                </p>
                {sessions.map((s, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: 'var(--space-4)', borderRadius: 'var(--radius-md)',
                    background: 'var(--color-bg-primary)', border: '1px solid var(--color-border-light)',
                    marginBottom: 'var(--space-2)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                      <Monitor size={18} style={{ color: 'var(--color-text-tertiary)' }} />
                      <div>
                        <p style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>
                          {s.device} {s.current && <span className="badge badge-success" style={{ marginLeft: 6 }}>Current</span>}
                        </p>
                        <p className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>{s.ip} · {s.lastActive}</p>
                      </div>
                    </div>
                    {!s.current && <button className="btn btn-sm btn-danger">Revoke</button>}
                  </div>
                ))}
              </div>
            )}

            {activePanel === 'notifikasi' && (
              <div className="card">
                <h3 className="card-title" style={{ marginBottom: 'var(--space-5)' }}>Preferensi Notifikasi</h3>
                {[
                  ['Circuit breaker state change', true],
                  ['Deferred fee gagal (5x retry)', true],
                  ['Rate limit spike terdeteksi', false],
                  ['New service registered', true],
                  ['JWT key mendekati expiration', true],
                ].map(([label, checked]) => (
                  <div key={label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: 'var(--space-3) 0', borderBottom: '1px solid var(--color-border-light)'
                  }}>
                    <span style={{ fontSize: 'var(--text-sm)' }}>{label}</span>
                    <input type="checkbox" defaultChecked={checked} style={{ accentColor: 'var(--color-primary)', width: 18, height: 18 }} />
                  </div>
                ))}
              </div>
            )}

            {activePanel === 'tampilan' && (
              <div className="card">
                <h3 className="card-title" style={{ marginBottom: 'var(--space-5)' }}>Preferensi Tampilan</h3>
                <div className="form-group">
                  <label className="form-label">Theme</label>
                  <select className="input" defaultValue="dark"><option value="dark">Dark (Default)</option><option value="light">Light</option></select>
                </div>
                <div className="form-group">
                  <label className="form-label">Timezone</label>
                  <select className="input" defaultValue="asia-jakarta"><option value="asia-jakarta">Asia/Jakarta (WIB, UTC+7)</option><option value="utc">UTC</option></select>
                </div>
                <div className="form-group">
                  <label className="form-label">Date Format</label>
                  <select className="input" defaultValue="iso"><option value="iso">ISO 8601 (2026-04-29)</option><option value="local">DD/MM/YYYY</option></select>
                </div>
                <button className="btn btn-primary"><Save size={14} /> Save Preferences</button>
              </div>
            )}

            {activePanel === 'audit' && (
              <div className="card">
                <h3 className="card-title" style={{ marginBottom: 'var(--space-5)' }}>Audit Aktivitas Anda</h3>
                <div className="data-table-wrapper" style={{ border: 'none' }}>
                  <table className="data-table">
                    <thead><tr><th>Time</th><th>Action</th><th>IP Address</th></tr></thead>
                    <tbody>
                      {activityLog.map((a, i) => (
                        <tr key={i}>
                          <td className="mono">{a.time}</td>
                          <td>{a.action}</td>
                          <td className="mono">{a.ip}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activePanel === 'apikeys' && (
              <div className="card">
                <h3 className="card-title" style={{ marginBottom: 'var(--space-5)' }}>Personal API Keys</h3>
                <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                  API keys untuk akses programatik ke Integrator Console API.
                </p>
                <div style={{ padding: 'var(--space-4)', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: 'var(--text-sm)' }}>gw_key_****_abcd</p>
                    <p className="mono" style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Created: 2026-04-01 · Last used: 2 jam lalu</p>
                  </div>
                  <button className="btn btn-sm btn-danger">Revoke</button>
                </div>
                <button className="btn btn-secondary" style={{ marginTop: 'var(--space-4)' }}><Plus size={14} /> Generate New Key</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
