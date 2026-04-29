import { useState } from 'react';
import TopBar from '../components/TopBar';
import { Save } from 'lucide-react';

const tabConfig = [
  { id: 'umum', label: 'Umum' },
  { id: 'fee', label: 'Fee & Pajak' },
  { id: 'ratelimit', label: 'Rate Limit' },
  { id: 'timeout', label: 'Timeout & Retry' },
  { id: 'logging', label: 'Logging' },
  { id: 'circuit', label: 'Circuit Breaker' },
];

export default function Configuration() {
  const [activeTab, setActiveTab] = useState('umum');

  return (
    <>
      <TopBar title="Konfigurasi" />
      <div className="page-container">
        <div className="page-header">
          <h1>Konfigurasi</h1>
          <p>Tunables sistem yang dapat diubah tanpa redeploy</p>
        </div>

        <div className="tab-strip">
          {tabConfig.map(t => (
            <button key={t.id} className={`tab-item ${activeTab === t.id ? 'active' : ''}`} onClick={() => setActiveTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="card">
          {activeTab === 'umum' && (
            <>
              <h3 className="card-title" style={{ marginBottom: 'var(--space-5)' }}>Pengaturan Umum</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Gateway Name</label>
                  <input className="input" defaultValue="Integrator Gateway v1.0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Environment</label>
                  <select className="input" defaultValue="dev">
                    <option value="dev">Development (DEV)</option>
                    <option value="staging">Staging</option>
                    <option value="prod">Production (PROD)</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Base URL</label>
                  <input className="input" defaultValue="http://localhost:8080" />
                </div>
                <div className="form-group">
                  <label className="form-label">CORS Allowed Origins</label>
                  <input className="input" defaultValue="http://localhost:3000, http://localhost:5173" />
                </div>
              </div>
            </>
          )}

          {activeTab === 'fee' && (
            <>
              <h3 className="card-title" style={{ marginBottom: 'var(--space-5)' }}>Fee & Pajak</h3>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                Konfigurasi biaya layanan integrasi sesuai Sheet 6 Aturan Keuangan
              </p>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Gateway Fee Rate</label>
                  <input className="input" type="number" step="0.001" defaultValue="0.005" />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>0.005 = 0.5% per transaksi (Sheet 6 No. 10)</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Fee Rounding Method</label>
                  <select className="input" defaultValue="half-up">
                    <option value="half-up">Rounding Half Up (Default)</option>
                    <option value="floor">Floor</option>
                    <option value="ceil">Ceiling</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Revenue Account ID</label>
                  <input className="input" defaultValue="GATEWAY_REVENUE" />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Fee Retry Count</label>
                  <input className="input" type="number" defaultValue="5" />
                </div>
                <div className="form-group">
                  <label className="form-label">Fee Retry Backoff (seconds)</label>
                  <input className="input" defaultValue="30, 120, 480, 1920, 7200" />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>30s, 2m, 8m, 32m, 2h (exponential)</span>
                </div>
                <div className="form-group">
                  <label className="form-label">SmartBank Payment Endpoint</label>
                  <input className="input" defaultValue="/smartbank/pembayaran_transaksi" />
                </div>
              </div>
            </>
          )}

          {activeTab === 'ratelimit' && (
            <>
              <h3 className="card-title" style={{ marginBottom: 'var(--space-5)' }}>Rate Limiting</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Read Rate Limit (per menit)</label>
                  <input className="input" type="number" defaultValue="60" />
                </div>
                <div className="form-group">
                  <label className="form-label">Transactional Rate Limit (per menit)</label>
                  <input className="input" type="number" defaultValue="10" />
                </div>
                <div className="form-group">
                  <label className="form-label">Cooldown Duration (detik)</label>
                  <input className="input" type="number" defaultValue="10" min="10" max="30" />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Range: 10–30 detik (Sheet 6 No. 15)</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Max Transaksi Harian per User</label>
                  <input className="input" type="number" defaultValue="10" />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Sheet 6 No. 16</span>
                </div>
                <div className="form-group">
                  <label className="form-label">IP Rate Limit (per menit)</label>
                  <input className="input" type="number" defaultValue="120" />
                </div>
              </div>
            </>
          )}

          {activeTab === 'timeout' && (
            <>
              <h3 className="card-title" style={{ marginBottom: 'var(--space-5)' }}>Timeout & Retry</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Default Timeout (ms)</label>
                  <input className="input" type="number" defaultValue="5000" />
                </div>
                <div className="form-group">
                  <label className="form-label">Default Retries</label>
                  <input className="input" type="number" defaultValue="0" />
                </div>
                <div className="form-group">
                  <label className="form-label">Max Hop Count</label>
                  <input className="input" type="number" defaultValue="3" />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Mencegah circular routing</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Retry Backoff Multiplier</label>
                  <input className="input" type="number" step="0.1" defaultValue="2.0" />
                </div>
              </div>
            </>
          )}

          {activeTab === 'logging' && (
            <>
              <h3 className="card-title" style={{ marginBottom: 'var(--space-5)' }}>Logging</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Log Level</label>
                  <select className="input" defaultValue="info">
                    <option value="debug">Debug</option><option value="info">Info</option>
                    <option value="warn">Warn</option><option value="error">Error</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Log Retention (hari)</label>
                  <input className="input" type="number" defaultValue="90" />
                </div>
                <div className="form-group">
                  <label className="form-label">Body Hashing Algorithm</label>
                  <select className="input" defaultValue="sha256"><option value="sha256">SHA-256</option><option value="sha512">SHA-512</option></select>
                </div>
                <div className="form-group">
                  <label className="form-label">PII Redaction</label>
                  <select className="input" defaultValue="true"><option value="true">Enabled (Default)</option><option value="false">Disabled</option></select>
                </div>
              </div>
            </>
          )}

          {activeTab === 'circuit' && (
            <>
              <h3 className="card-title" style={{ marginBottom: 'var(--space-5)' }}>Circuit Breaker</h3>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label">Failure Threshold (5xx berturut-turut)</label>
                  <input className="input" type="number" defaultValue="5" />
                </div>
                <div className="form-group">
                  <label className="form-label">Timeout Threshold (dalam window)</label>
                  <input className="input" type="number" defaultValue="3" />
                </div>
                <div className="form-group">
                  <label className="form-label">Window Duration (detik)</label>
                  <input className="input" type="number" defaultValue="30" />
                </div>
                <div className="form-group">
                  <label className="form-label">Open Duration (detik)</label>
                  <input className="input" type="number" defaultValue="60" />
                  <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)' }}>Durasi sebelum berubah ke HALF-OPEN</span>
                </div>
              </div>
            </>
          )}

          <div style={{ marginTop: 'var(--space-5)', display: 'flex', gap: 'var(--space-3)' }}>
            <button className="btn btn-primary"><Save size={14} /> Save Configuration</button>
            <button className="btn btn-secondary">Reset to Defaults</button>
          </div>
        </div>
      </div>
    </>
  );
}
