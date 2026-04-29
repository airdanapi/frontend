import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RequestLogs from './pages/RequestLogs';
import GatewayFees from './pages/GatewayFees';
import RouteRegistry from './pages/RouteRegistry';
import ServiceHealth from './pages/ServiceHealth';
import SecurityJWT from './pages/SecurityJWT';
import SettingsPage from './pages/Settings';
import Configuration from './pages/Configuration';
import './App.css';

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login — tanpa sidebar */}
        <Route path="/login" element={<Login />} />

        {/* Protected pages — dengan sidebar */}
        <Route path="/dashboard" element={<AppLayout><Dashboard /></AppLayout>} />
        <Route path="/logs" element={<AppLayout><RequestLogs /></AppLayout>} />
        <Route path="/fees" element={<AppLayout><GatewayFees /></AppLayout>} />
        <Route path="/routes" element={<AppLayout><RouteRegistry /></AppLayout>} />
        <Route path="/health" element={<AppLayout><ServiceHealth /></AppLayout>} />
        <Route path="/security" element={<AppLayout><SecurityJWT /></AppLayout>} />
        <Route path="/settings" element={<AppLayout><SettingsPage /></AppLayout>} />
        <Route path="/configuration" element={<AppLayout><Configuration /></AppLayout>} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
