import { useState } from 'react';
import TopBar from '../components/TopBar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, RefreshCw } from 'lucide-react';

const revenueData = [
  { date: 'Sen', revenue: 42000 }, { date: 'Sel', revenue: 38500 },
  { date: 'Rab', revenue: 51200 }, { date: 'Kam', revenue: 47800 },
  { date: 'Jum', revenue: 55300 }, { date: 'Sab', revenue: 32100 },
  { date: 'Min', revenue: 17600 },
];

const sourceData = [
  { name: 'PasarKita', value: 45, color: '#EA580C' },
  { name: 'WarungPOS', value: 25, color: '#F97316' },
  { name: 'SupplierHub', value: 18, color: '#FB923C' },
  { name: 'LogistiKita', value: 12, color: '#FDBA74' },
];

const pendingFees = [
  { id: 'fee_001', request_id: '550e8400-e29b-001', user_id: 'user_102', amount: 500, status: 'PENDING', retries: 2, created_at: '2026-04-29 14:23:45' },
  { id: 'fee_002', request_id: '550e8400-e29b-002', user_id: 'user_115', amount: 250, status: 'PENDING', retries: 4, created_at: '2026-04-29 13:18:12' },
  { id: 'fee_003', request_id: '550e8400-e29b-003', user_id: 'user_108', amount: 1000, status: 'FAILED', retries: 5, created_at: '2026-04-29 12:10:33' },
  { id: 'fee_004', request_id: '550e8400-e29b-004', user_id: 'user_121', amount: 750, status: 'DEFERRED', retries: 1, created_at: '2026-04-29 11:55:08' },
];

const topUsers = [
  { user_id: 'user_102', total_fees: 12500, tx_count: 48 },
  { user_id: 'user_115', total_fees: 9800, tx_count: 36 },
  { user_id: 'user_108', total_fees: 8200, tx_count: 31 },
  { user_id: 'user_121', total_fees: 6500, tx_count: 24 },
  { user_id: 'user_130', total_fees: 5100, tx_count: 19 },
];

function statusBadge(s) {
  const map = { PAID: 'badge-success', PENDING: 'badge-warning', FAILED: 'badge-danger', DEFERRED: 'badge-info' };
  return <span className={`badge ${map[s]}`}>{s}</span>;
}

export default function GatewayFees() {
  const [period, setPeriod] = useState('week');

  return (
    <>
      <TopBar title="Gateway Fees" />
      <div className="page-container">
        <div className="page-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1>Gateway Fees</h1>
              <p>Pendapatan dari biaya layanan integrasi 0.5%</p>
            </div>
            <button className="btn btn-secondary"><Download size={14} /> Export CSV</button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid-3" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="kpi-tile">
            <div className="kpi-label">Total Revenue (Minggu Ini)</div>
            <div className="kpi-value monetary">Rp 284.500</div>
            <div className="kpi-change positive">+22.1% vs minggu lalu</div>
          </div>
          <div className="kpi-tile">
            <div className="kpi-label">Fee Collection Rate</div>
            <div className="kpi-value">99.2%</div>
            <div className="kpi-change positive">Target: &gt;99%</div>
          </div>
          <div className="kpi-tile">
            <div className="kpi-label">Pending / Failed Fees</div>
            <div className="kpi-value" style={{ color: 'var(--color-warning)' }}>4</div>
            <div className="kpi-change negative">Perlu rekonsiliasi</div>
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: 'var(--space-5)' }}>
          {/* Revenue Trend */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Revenue Trend</span>
              <div className="pill-group">
                {['day', 'week', 'month'].map(p => (
                  <button key={p} className={`pill ${period === p ? 'active' : ''}`} onClick={() => setPeriod(p)}>
                    {p === 'day' ? 'Hari' : p === 'week' ? 'Minggu' : 'Bulan'}
                  </button>
                ))}
              </div>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7E22CE" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#7E22CE" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.2)" />
                  <XAxis dataKey="date" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${v/1000}k`} />
                  <Tooltip formatter={(v) => [`Rp ${v.toLocaleString()}`, 'Revenue']} contentStyle={{ background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 13 }} />
                  <Area type="monotone" dataKey="revenue" stroke="#7E22CE" strokeWidth={2} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Source Distribution */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Revenue by Source App</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
              <div style={{ width: 180, height: 180 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={sourceData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" strokeWidth={0}>
                      {sourceData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div style={{ flex: 1 }}>
                {sourceData.map(s => (
                  <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', fontSize: 'var(--text-sm)' }}>
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: s.color, flexShrink: 0 }} />
                    <span style={{ color: 'var(--color-text-secondary)', flex: 1 }}>{s.name}</span>
                    <span style={{ fontWeight: 600 }}>{s.value}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 'var(--space-5)' }}>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Top Users by Fee</h4>
              {topUsers.map((u, i) => (
                <div key={u.user_id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ width: 20, fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>#{i + 1}</span>
                  <span className="mono" style={{ flex: 1, fontSize: 'var(--text-sm)' }}>{u.user_id}</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-monetary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Rp {u.total_fees.toLocaleString()}</span>
                  <span className="badge badge-info">{u.tx_count} tx</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pending/Failed Fees Table */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Pending & Failed Fees</span>
            <span className="badge badge-warning">{pendingFees.length} items</span>
          </div>
          <div className="data-table-wrapper" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr><th>Fee ID</th><th>Request ID</th><th>User</th><th>Amount</th><th>Status</th><th>Retries</th><th>Created</th><th>Action</th></tr>
              </thead>
              <tbody>
                {pendingFees.map(f => (
                  <tr key={f.id}>
                    <td className="mono">{f.id}</td>
                    <td className="mono" style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.request_id}</td>
                    <td className="mono">{f.user_id}</td>
                    <td style={{ color: 'var(--color-monetary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Rp {f.amount.toLocaleString()}</td>
                    <td>{statusBadge(f.status)}</td>
                    <td className="mono">{f.retries}/5</td>
                    <td className="mono">{f.created_at}</td>
                    <td>
                      <button className="btn btn-sm btn-secondary"><RefreshCw size={12} /> Retry</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
