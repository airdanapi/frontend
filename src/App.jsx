import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProtectedRoute from './components/ProtectedRoute';
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
  const protectedPage = (page) => (
    <ProtectedRoute>
      <AppLayout>{page}</AppLayout>
    </ProtectedRoute>
  );

  return (
    <BrowserRouter>
      <Routes>
        {/* Login — tanpa sidebar */}
        <Route path="/login" element={<Login />} />

        {/* Protected pages — dengan sidebar */}
        <Route path="/dashboard" element={protectedPage(<Dashboard />)} />
        <Route path="/logs" element={protectedPage(<RequestLogs />)} />
        <Route path="/fees" element={protectedPage(<GatewayFees />)} />
        <Route path="/routes" element={protectedPage(<RouteRegistry />)} />
        <Route path="/health" element={protectedPage(<ServiceHealth />)} />
        <Route path="/security" element={protectedPage(<SecurityJWT />)} />
        <Route path="/settings" element={protectedPage(<SettingsPage />)} />
        <Route path="/configuration" element={protectedPage(<Configuration />)} />

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
