import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, RefreshCw, AlertCircle } from 'lucide-react';
import apiService from '../services/api';

function statusBadge(s) {
  const map = { PAID: 'badge-success', PENDING: 'badge-warning', FAILED: 'badge-danger', DEFERRED: 'badge-info' };
  return <span className={`badge ${map[s]}`}>{s}</span>;
}

export default function GatewayFees() {
  const [period, setPeriod] = useState('week');
  const [stats, setStats] = useState(null);
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadFeesData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadFeesData, 30000);
    return () => clearInterval(interval);
  }, [period]);

  const loadFeesData = async () => {
    try {
      setLoading(true);
      const [statsRes, feesRes] = await Promise.all([
        apiService.getFeeStats({ period }),
        apiService.getFees({ status: 'PENDING,FAILED,DEFERRED', limit: 20 })
      ]);
      
      console.log('Stats response:', statsRes);
      console.log('Fees response:', feesRes);
      
      setStats(statsRes?.data || {});
      setFees(feesRes?.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load fees data:', err);
      setError(err?.message || 'Gagal memuat data fee');
    } finally {
      setLoading(false);
    }
  };

  const handleRetryFee = async (feeId) => {
    try {
      await apiService.post(`/integrator/biaya_layanan_integrasi/${feeId}/retry`);
      loadFeesData(); // Reload data after retry
    } catch (err) {
      console.error('Failed to retry fee:', err);
      alert('Failed to retry fee: ' + err.message);
    }
  };

  const handleExportCSV = async () => {
    try {
      const response = await apiService.get('/integrator/biaya_layanan_integrasi/export');
      // Create download link
      const blob = new Blob([response.data], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `gateway-fees-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to export CSV:', err);
      alert('Failed to export CSV: ' + err.message);
    }
  };

  if (loading) {
    return (
      <>
        <TopBar title="Gateway Fees" />
        <div className="page-container">
          <div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>
        </div>
      </>
    );
  }

  const revenueData = stats?.revenue_trend || [];
  const sourceDataRaw = stats?.revenue_by_source || [];
  const topUsers = stats?.top_users || [];
  const totalRevenue = stats?.total_revenue || 0;
  const collectionRate = stats?.collection_rate || 0;
  const pendingCount = stats?.pending_count || 0;
  const revenueChange = stats?.revenue_change_pct || 0;

  // Add colors to source data
  const colors = ['#7E22CE', '#EA580C', '#3B82F6', '#10B981'];
  const sourceData = sourceDataRaw.map((item, idx) => ({
    ...item,
    color: colors[idx % colors.length]
  }));

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
            <button className="btn btn-secondary" onClick={handleExportCSV}><Download size={14} /> Export CSV</button>
          </div>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: 'var(--space-4)' }}>
            <AlertCircle size={16} style={{ marginRight: 8 }} />
            Error loading fees data: {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid-3" style={{ marginBottom: 'var(--space-5)' }}>
          <div className="kpi-tile">
            <div className="kpi-label">Total Revenue ({period === 'day' ? 'Hari Ini' : period === 'week' ? 'Minggu Ini' : 'Bulan Ini'})</div>
            <div className="kpi-value monetary">Rp {totalRevenue.toLocaleString()}</div>
            <div className={`kpi-change ${revenueChange >= 0 ? 'positive' : 'negative'}`}>
              {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}% vs periode lalu
            </div>
          </div>
          <div className="kpi-tile">
            <div className="kpi-label">Fee Collection Rate</div>
            <div className="kpi-value">{collectionRate.toFixed(1)}%</div>
            <div className={`kpi-change ${collectionRate >= 99 ? 'positive' : 'negative'}`}>
              Target: &gt;99%
            </div>
          </div>
          <div className="kpi-tile">
            <div className="kpi-label">Pending / Failed Fees</div>
            <div className="kpi-value" style={{ color: pendingCount > 0 ? 'var(--color-warning)' : 'var(--color-success)' }}>
              {pendingCount}
            </div>
            <div className={`kpi-change ${pendingCount > 0 ? 'negative' : 'positive'}`}>
              {pendingCount > 0 ? 'Perlu rekonsiliasi' : 'Semua terbayar'}
            </div>
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
              {topUsers && topUsers.length > 0 ? topUsers.map((u, i) => (
                <div key={u.user_id} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2) 0', borderBottom: '1px solid var(--color-border-light)' }}>
                  <span style={{ width: 20, fontSize: 'var(--text-xs)', color: 'var(--color-text-tertiary)', textAlign: 'center' }}>#{i + 1}</span>
                  <span className="mono" style={{ flex: 1, fontSize: 'var(--text-sm)' }}>{u.user_id}</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-monetary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>({u.count || 0}x)</span>
                </div>
              )) : (
                <div style={{ padding: 'var(--space-3)', color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)' }}>Tidak ada data</div>
              )}
            </div>
          </div>
        </div>

        {/* Pending/Failed Fees Table */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Pending & Failed Fees</span>
            <span className="badge badge-warning">{fees.length} items</span>
          </div>
          <div className="data-table-wrapper" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr><th>Fee ID</th><th>Request ID</th><th>User</th><th>Fee Amount</th><th>Status</th><th>Retries</th><th>Created</th><th>Action</th></tr>
              </thead>
              <tbody>
                {fees.map(f => (
                  <tr key={f.id}>
                    <td className="mono">{f.id}</td>
                    <td className="mono" style={{ maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis' }}>{f.request_id}</td>
                    <td className="mono">{f.user_id}</td>
                    <td style={{ color: 'var(--color-monetary)', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>Rp {f.fee_amount?.toLocaleString() || '0'}</td>
                    <td>{statusBadge(f.status)}</td>
                    <td className="mono">{f.retry_count || 0}/5</td>
                    <td className="mono">{new Date(f.created_at).toLocaleString()}</td>
                    <td>
                      <button className="btn btn-sm btn-secondary" onClick={() => handleRetryFee(f.id)}>
                        <RefreshCw size={12} /> Retry
                      </button>
                    </td>
                  </tr>
                ))}
                {fees.length === 0 && (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: 'var(--color-text-secondary)' }}>
                    Tidak ada fee yang pending atau failed
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
