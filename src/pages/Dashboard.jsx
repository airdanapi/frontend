import TopBar from '../components/TopBar';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Activity, AlertCircle, Clock, Coins } from 'lucide-react';

const throughputData = [
  { time: '00:00', requests: 120 }, { time: '02:00', requests: 85 },
  { time: '04:00', requests: 45 }, { time: '06:00', requests: 78 },
  { time: '08:00', requests: 210 }, { time: '10:00', requests: 380 },
  { time: '12:00', requests: 450 }, { time: '14:00', requests: 520 },
  { time: '16:00', requests: 480 }, { time: '18:00', requests: 390 },
  { time: '20:00', requests: 280 }, { time: '22:00', requests: 180 },
];

const serviceData = [
  { name: 'PasarKita', requests: 1240 },
  { name: 'WarungPOS', requests: 890 },
  { name: 'SupplierHub', requests: 560 },
  { name: 'LogistiKita', requests: 420 },
  { name: 'SmartBank', requests: 2100 },
  { name: 'UMKM Insight', requests: 310 },
];

const recentErrors = [
  { time: '14:23:45', service: 'SupplierHub', endpoint: '/supplier/pay', status: 502, message: 'UPSTREAM_FAILED' },
  { time: '14:18:12', service: 'LogistiKita', endpoint: '/logistics/pay', status: 429, message: 'RATE_LIMITED' },
  { time: '14:10:33', service: 'PasarKita', endpoint: '/marketplace/checkout', status: 401, message: 'AUTH_INVALID_TOKEN' },
  { time: '13:55:08', service: 'WarungPOS', endpoint: '/pos/pay', status: 503, message: 'CIRCUIT_OPEN' },
];

const circuitStates = [
  { service: 'SmartBank', state: 'CLOSED', latency: '12ms' },
  { service: 'PasarKita', state: 'CLOSED', latency: '28ms' },
  { service: 'WarungPOS', state: 'CLOSED', latency: '15ms' },
  { service: 'SupplierHub', state: 'HALF-OPEN', latency: '450ms' },
  { service: 'LogistiKita', state: 'CLOSED', latency: '22ms' },
  { service: 'UMKM Insight', state: 'CLOSED', latency: '8ms' },
];

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
            <div className="kpi-value">12,847</div>
            <div className="kpi-change positive"><TrendingUp size={12} /> +14.2% vs kemarin</div>
          </div>
          <div className="kpi-tile">
            <div className="kpi-label"><AlertCircle size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />Error Rate</div>
            <div className="kpi-value">0.38%</div>
            <div className="kpi-change positive"><TrendingDown size={12} /> -0.12%</div>
          </div>
          <div className="kpi-tile">
            <div className="kpi-label"><Clock size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />p95 Latency</div>
            <div className="kpi-value">42ms</div>
            <div className="kpi-change positive"><TrendingDown size={12} /> -8ms</div>
          </div>
          <div className="kpi-tile">
            <div className="kpi-label"><Coins size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />Fee Revenue</div>
            <div className="kpi-value monetary">Rp 284.500</div>
            <div className="kpi-change positive"><TrendingUp size={12} /> +22.1%</div>
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
              <ResponsiveContainer width="100%" height="100%">
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
              <ResponsiveContainer width="100%" height="100%">
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
                  {circuitStates.map(c => (
                    <tr key={c.service}>
                      <td style={{ fontWeight: 500 }}>{c.service}</td>
                      <td>{getCircuitBadge(c.state)}</td>
                      <td className="mono">{c.latency}</td>
                    </tr>
                  ))}
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
                    <tr key={i}>
                      <td className="mono">{e.time}</td>
                      <td style={{ fontWeight: 500 }}>{e.service}</td>
                      <td>{getStatusBadge(e.status)}</td>
                      <td className="mono" style={{ color: 'var(--color-danger)' }}>{e.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
