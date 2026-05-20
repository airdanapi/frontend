import { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Activity, AlertCircle, Clock, Coins } from 'lucide-react';
import apiService from '../services/api';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-md)', padding: '8px 12px', fontSize: 'var(--text-sm)'
      }}>
        <p style={{ color: 'var(--color-text-secondary)', marginBottom: 4 }}>{label}</p>
        <p style={{ color: 'var(--color-primary)', fontWeight: 600 }}>{payload[0].value} requests</p>
      </div>
    );
  }
  return null;
};

function getCircuitBadge(state) {
  const map = { 'CLOSED': 'badge-success', 'OPEN': 'badge-danger', 'HALF-OPEN': 'badge-warning' };
  return <span className={`badge ${map[state] || 'badge-info'}`}>{state}</span>;
}

function getStatusBadge(status) {
  if (status >= 500) return <span className="badge badge-danger">{status}</span>;
  if (status >= 400) return <span className="badge badge-warning">{status}</span>;
  return <span className="badge badge-success">{status}</span>;
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [circuits, setCircuits] = useState([]);
  const [recentErrors, setRecentErrors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDashboardData = async () => {
    try {
      const [logStatsRes, circuitStatesRes, logsRes, feeStatsRes] = await Promise.all([
        apiService.getLogStats(),
        apiService.getCircuitStates(),
        apiService.getLogs({ limit: 10, status: 'FAILED' }),
        apiService.getFeeStats()
      ]);
      
      setStats({
        logs: logStatsRes.data || {},
        fees: feeStatsRes.data || {}
      });
      setCircuits(circuitStatesRes.data || []);
      setRecentErrors(logsRes.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <TopBar title="Dashboard" />
        <div className="page-container">
          <div style={{ textAlign: 'center', padding: '60px' }}>Loading...</div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <TopBar title="Dashboard" />
        <div className="page-container">
          <div className="alert alert-danger">
            <AlertCircle size={16} style={{ marginRight: 8 }} />
            Error loading dashboard: {error}
          </div>
        </div>
      </>
    );
  }

  // Transform API data for charts
  const throughputData = stats?.logs?.hourly_requests || [];
  const serviceData = stats?.logs?.top_services || [];
  
  // Calculate KPIs
  const totalRequests = stats?.logs?.total_requests || 0;
  const errorRate = stats?.logs?.error_rate || 0;
  const p95Latency = stats?.logs?.p95_latency_ms || 0;
  const feeRevenue = stats?.fees?.total_revenue || 0;
  const requestsChange = stats?.logs?.requests_change_pct || 0;
  const errorRateChange = stats?.logs?.error_rate_change_pct || 0;
  const latencyChange = stats?.logs?.latency_change_ms || 0;
  const revenueChange = stats?.fees?.revenue_change_pct || 0;

  return (
    <>
      <TopBar title="Dashboard" />
      <div className="page-container">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Snapshot operasional Gateway 24 jam terakhir</p>
        </div>

        {/* KPI Tiles */}
        <div className="kpi-grid">
          <div className="kpi-tile">
            <div className="kpi-label"><Activity size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />Total Requests</div>
            <div className="kpi-value">{totalRequests.toLocaleString()}</div>
            <div className={`kpi-change ${requestsChange >= 0 ? 'positive' : 'negative'}`}>
              {requestsChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />} 
              {requestsChange >= 0 ? '+' : ''}{requestsChange.toFixed(1)}% vs kemarin
            </div>
          </div>
          <div className="kpi-tile">
            <div className="kpi-label"><AlertCircle size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />Error Rate</div>
            <div className="kpi-value">{errorRate.toFixed(2)}%</div>
            <div className={`kpi-change ${errorRateChange <= 0 ? 'positive' : 'negative'}`}>
              {errorRateChange <= 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />} 
              {errorRateChange >= 0 ? '+' : ''}{errorRateChange.toFixed(2)}%
            </div>
          </div>
          <div className="kpi-tile">
            <div className="kpi-label"><Clock size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />p95 Latency</div>
            <div className="kpi-value">{p95Latency}ms</div>
            <div className={`kpi-change ${latencyChange <= 0 ? 'positive' : 'negative'}`}>
              {latencyChange <= 0 ? <TrendingDown size={12} /> : <TrendingUp size={12} />} 
              {latencyChange >= 0 ? '+' : ''}{latencyChange}ms
            </div>
          </div>
          <div className="kpi-tile">
            <div className="kpi-label"><Coins size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />Fee Revenue</div>
            <div className="kpi-value monetary">Rp {feeRevenue.toLocaleString()}</div>
            <div className={`kpi-change ${revenueChange >= 0 ? 'positive' : 'negative'}`}>
              {revenueChange >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />} 
              {revenueChange >= 0 ? '+' : ''}{revenueChange.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="grid-2" style={{ marginBottom: 'var(--space-5)' }}>
          {/* Throughput Chart */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Throughput (24h)</span>
              <span className="card-subtitle">requests / jam</span>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%" minWidth={1}>
                <AreaChart data={throughputData}>
                  <defs>
                    <linearGradient id="colorReq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#EA580C" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#EA580C" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.2)" />
                  <XAxis dataKey="time" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="requests" stroke="#EA580C" strokeWidth={2} fill="url(#colorReq)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Top Services */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Top Services</span>
              <span className="card-subtitle">by request volume</span>
            </div>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%" minWidth={1}>
                <BarChart data={serviceData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(71,85,105,0.2)" horizontal={false} />
                  <XAxis type="number" tick={{ fill: '#64748B', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis dataKey="name" type="category" tick={{ fill: '#94A3B8', fontSize: 11 }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="requests" fill="#EA580C" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid-2">
          {/* Circuit Breakers */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Circuit Breakers</span>
            </div>
            <div className="data-table-wrapper" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr><th>Service</th><th>State</th><th>Latency</th></tr>
                </thead>
                <tbody>
                  {circuits.map(c => (
                    <tr key={c.service_name || c.service}>
                      <td style={{ fontWeight: 500 }}>{c.service_name || c.service}</td>
                      <td>{getCircuitBadge(c.state)}</td>
                      <td className="mono">{c.avg_latency_ms ? `${c.avg_latency_ms}ms` : 'N/A'}</td>
                    </tr>
                  ))}
                  {circuits.length === 0 && (
                    <tr><td colSpan="3" style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>No data available</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Errors */}
          <div className="card">
            <div className="card-header">
              <span className="card-title">Recent Errors</span>
              <span className="badge badge-danger">{recentErrors.length}</span>
            </div>
            <div className="data-table-wrapper" style={{ border: 'none' }}>
              <table className="data-table">
                <thead>
                  <tr><th>Time</th><th>Service</th><th>Status</th><th>Error</th></tr>
                </thead>
                <tbody>
                  {recentErrors.map((e, i) => (
                    <tr key={e.request_id || i}>
                      <td className="mono">{new Date(e.created_at).toLocaleTimeString()}</td>
                      <td style={{ fontWeight: 500 }}>{e.target_app || e.service}</td>
                      <td>{getStatusBadge(e.status_code || e.status)}</td>
                      <td className="mono" style={{ color: 'var(--color-danger)' }}>{e.error_code || e.message}</td>
                    </tr>
                  ))}
                  {recentErrors.length === 0 && (
                    <tr><td colSpan="4" style={{ textAlign: 'center', color: 'var(--color-text-secondary)' }}>No recent errors</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
