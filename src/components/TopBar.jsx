import { Bell, User } from 'lucide-react';

export default function TopBar({ title }) {
  const env = import.meta.env.VITE_ENV || 'DEV';
  
  const envColors = {
    DEV: { bg: '#DBEAFE', text: '#1E40AF' },
    STAGING: { bg: '#FEF3C7', text: '#92400E' },
    PROD: { bg: '#FEE2E2', text: '#991B1B' }
  };

  const envStyle = envColors[env] || envColors.DEV;

  return (
    <div className="top-bar">
      <div className="top-bar-left">
        <h2 className="top-bar-title">{title}</h2>
      </div>
      <div className="top-bar-right">
        <div className="env-badge" style={{ 
          background: envStyle.bg, 
          color: envStyle.text 
        }}>
          {env}
        </div>
        <button className="icon-btn">
          <Bell size={18} />
        </button>
        <button className="icon-btn">
          <User size={18} />
        </button>
      </div>

      <style>{`
        .top-bar {
          height: 64px;
          background: var(--color-bg-card);
          border-bottom: 1px solid var(--color-border-light);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 var(--space-6);
          position: sticky;
          top: 0;
          z-index: 30;
        }

        .top-bar-title {
          font-size: var(--text-xl);
          font-weight: 700;
          color: var(--color-text-primary);
        }

        .top-bar-right {
          display: flex;
          align-items: center;
          gap: var(--space-3);
        }

        .env-badge {
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 700;
          letter-spacing: 0.05em;
        }

        .icon-btn {
          width: 36px;
          height: 36px;
          border-radius: var(--radius-md);
          border: 1px solid var(--color-border);
          background: var(--color-bg-secondary);
          color: var(--color-text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all var(--transition-fast);
        }

        .icon-btn:hover {
          background: var(--color-bg-hover);
          color: var(--color-text-primary);
        }
      `}</style>
    </div>
  );
}
