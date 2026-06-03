import { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ScrollText, Coins, Route, HeartPulse,
  ShieldCheck, Settings, SlidersHorizontal, LogOut, Radio
} from 'lucide-react';
import apiService from '../services/api';
import ConfirmModal from './ConfirmModal';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/logs', label: 'Request Logs', icon: ScrollText },
  { path: '/fees', label: 'Gateway Fees', icon: Coins },
  { path: '/routes', label: 'Route Registry', icon: Route },
  { path: '/health', label: 'Service Health', icon: HeartPulse },
  { path: '/security', label: 'Security & JWT', icon: ShieldCheck },
  { path: '/configuration', label: 'Konfigurasi', icon: SlidersHorizontal },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    try {
      await apiService.logout();
    } catch {
      // Even if the API call fails, still clear local state
    }
    // Clear any remaining user data from localStorage
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setShowLogoutModal(false);
    navigate('/login', { replace: true });
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">
          <Radio size={22} />
        </div>
        <div className="sidebar-brand-text">
          <span className="sidebar-brand-name">Integrator</span>
          <span className="sidebar-brand-sub">API Gateway v1.0</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {isActive && <div className="sidebar-active-indicator" />}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-status">
          <div className="sidebar-status-dot" />
          <span>System Operational</span>
        </div>
        <button
          className="sidebar-link sidebar-logout-btn"
          onClick={() => setShowLogoutModal(true)}
          id="sidebar-logout-button"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>

      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        title="Log Out"
        message="Apakah Anda yakin ingin keluar dari Integrator Console? Anda harus login kembali untuk mengakses dashboard."
        confirmText="Log Out"
      />

      <style>{`
        .sidebar {
          position: fixed;
          top: 0;
          left: 0;
          width: var(--sidebar-width);
          height: 100vh;
          background: var(--color-bg-secondary);
          border-right: 1px solid var(--color-border-light);
          display: flex;
          flex-direction: column;
          z-index: 40;
          overflow-y: auto;
        }

        .sidebar-brand {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-5) var(--space-5);
          border-bottom: 1px solid var(--color-border-light);
        }

        .sidebar-logo {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          background: var(--color-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }

        .sidebar-brand-name {
          font-size: var(--text-md);
          font-weight: 700;
          color: var(--color-text-primary);
          display: block;
          line-height: 1.2;
        }

        .sidebar-brand-sub {
          font-size: var(--text-xs);
          color: var(--color-text-tertiary);
          display: block;
        }

        .sidebar-nav {
          flex: 1;
          padding: var(--space-3);
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-link {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          padding: var(--space-2) var(--space-3);
          border-radius: var(--radius-md);
          color: var(--color-text-secondary);
          font-size: var(--text-sm);
          font-weight: 500;
          text-decoration: none;
          transition: all var(--transition-fast);
          position: relative;
        }

        .sidebar-link:hover {
          background: var(--color-bg-hover);
          color: var(--color-text-primary);
        }

        .sidebar-link.active {
          background: var(--color-primary-light);
          color: var(--color-primary);
          font-weight: 600;
        }

        .sidebar-active-indicator {
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 3px;
          height: 20px;
          background: var(--color-primary);
          border-radius: var(--radius-full);
        }

        .sidebar-footer {
          padding: var(--space-3);
          border-top: 1px solid var(--color-border-light);
        }

        .sidebar-status {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-2) var(--space-3);
          font-size: var(--text-xs);
          color: var(--color-success);
          margin-bottom: var(--space-1);
        }

        .sidebar-status-dot {
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: var(--color-success);
          box-shadow: 0 0 6px var(--color-success);
          animation: pulse 2s ease-in-out infinite;
        }

        .sidebar-logout-btn {
          width: 100%;
          border: none;
          cursor: pointer;
          background: none;
          font-family: var(--font-ui);
        }

        .sidebar-logout-btn:hover {
          background: var(--color-danger-light) !important;
          color: var(--color-danger) !important;
        }
      `}</style>
    </aside>
  );
}
