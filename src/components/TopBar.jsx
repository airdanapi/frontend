import { Bell, Search, User } from 'lucide-react';

export default function TopBar({ title }) {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2 className="topbar-title">{title}</h2>
      </div>

      <div className="topbar-right">
        <div className="topbar-env-badge">DEV</div>

        <div className="topbar-search">
          <Search size={14} />
          <input type="text" placeholder="Search..." className="topbar-search-input" />
        </div>

        <button className="topbar-icon-btn">
          <Bell size={18} />
          <span className="topbar-notif-dot" />
        </button>

        <div className="topbar-user">
          <div className="topbar-avatar">
            <User size={16} />
          </div>
          <div className="topbar-user-info">
            <span className="topbar-user-name">Operator</span>
            <span className="topbar-user-role">Admin</span>
          </div>
        </div>
      </div>

      <style>{`
        .topbar {
          position: fixed;
          top: 0;
          left: var(--sidebar-width);
          right: 0;
          height: var(--topbar-height);
          background: rgba(30, 41, 59, 0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid var(--color-border-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-6);
          z-index: 35;
        }

        .topbar-title {
          font-size: var(--text-md);
          font-weight: 600;
          color: var(--color-text-primary);
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: var(--space-4);
        }

        .topbar-env-badge {
          padding: 2px 10px;
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 700;
          background: var(--color-info-light);
          color: var(--color-info);
          letter-spacing: 0.08em;
        }

        .topbar-search {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding: var(--space-1) var(--space-3);
          background: var(--color-bg-primary);
          border: 1px solid var(--color-border-light);
          border-radius: var(--radius-md);
          color: var(--color-text-tertiary);
        }

        .topbar-search-input {
          border: none;
          background: transparent;
          color: var(--color-text-primary);
          font-family: var(--font-ui);
          font-size: var(--text-sm);
          outline: none;
          width: 140px;
        }

        .topbar-search-input::placeholder {
          color: var(--color-text-muted);
        }

        .topbar-icon-btn {
          position: relative;
          background: transparent;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          padding: var(--space-2);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .topbar-icon-btn:hover {
          background: var(--color-bg-hover);
          color: var(--color-text-primary);
        }

        .topbar-notif-dot {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 7px;
          height: 7px;
          background: var(--color-danger);
          border-radius: 50%;
          border: 2px solid var(--color-bg-secondary);
        }

        .topbar-user {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          cursor: pointer;
          padding: var(--space-1) var(--space-2);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .topbar-user:hover {
          background: var(--color-bg-hover);
        }

        .topbar-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-secondary);
        }

        .topbar-user-info {
          display: flex;
          flex-direction: column;
        }

        .topbar-user-name {
          font-size: var(--text-sm);
          font-weight: 600;
          color: var(--color-text-primary);
          line-height: 1.2;
        }

        .topbar-user-role {
          font-size: var(--text-xs);
          color: var(--color-text-tertiary);
        }
      `}</style>
    </header>
  );
}
