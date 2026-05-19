import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, Eye, EyeOff } from 'lucide-react';
import apiService from '../services/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await apiService.login(email, password);
      if (response.success) {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-bg-glow" />
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <Radio size={28} />
          </div>
          <h1 className="login-title">Integrator Console</h1>
          <p className="login-subtitle">API Gateway — Ekosistem UMKM</p>
          <div className="login-env-badge">DEV ENVIRONMENT</div>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              padding: 'var(--space-3)',
              background: 'var(--color-danger-light)',
              color: 'var(--color-danger)',
              borderRadius: 'var(--radius-md)',
              fontSize: 'var(--text-sm)',
              marginBottom: 'var(--space-4)'
            }}>
              {error}
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="operator@gateway.local"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                className="input"
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                style={{
                  position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                  background: 'none', border: 'none', color: 'var(--color-text-tertiary)',
                  cursor: 'pointer', padding: 4
                }}
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: 'var(--space-3)', fontSize: 'var(--text-md)', marginTop: 'var(--space-2)' }}
            disabled={loading}
          >
            {loading ? (
              <span className="login-spinner" />
            ) : 'Sign In'}
          </button>
        </form>

        <p className="login-footer-text">
          Kelompok 7.0 — Tugas Besar RPL 2
        </p>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg-primary);
          position: relative;
          overflow: hidden;
        }

        .login-bg-glow {
          position: absolute;
          width: 600px;
          height: 600px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(234, 88, 12, 0.08) 0%, transparent 70%);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .login-card {
          width: 400px;
          max-width: 90vw;
          background: var(--color-bg-card);
          border: 1px solid var(--color-border-light);
          border-radius: var(--radius-xl);
          padding: var(--space-10);
          backdrop-filter: blur(20px);
          position: relative;
          z-index: 1;
          box-shadow: var(--shadow-lg);
        }

        .login-header {
          text-align: center;
          margin-bottom: var(--space-8);
        }

        .login-logo {
          width: 56px;
          height: 56px;
          border-radius: var(--radius-lg);
          background: linear-gradient(135deg, var(--color-primary), #F97316);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          margin: 0 auto var(--space-4);
          box-shadow: 0 4px 20px rgba(234, 88, 12, 0.3);
        }

        .login-title {
          font-size: var(--text-2xl);
          font-weight: 800;
          color: var(--color-text-primary);
          margin-bottom: var(--space-1);
        }

        .login-subtitle {
          font-size: var(--text-sm);
          color: var(--color-text-secondary);
          margin-bottom: var(--space-3);
        }

        .login-env-badge {
          display: inline-block;
          padding: 2px 12px;
          border-radius: var(--radius-full);
          font-size: var(--text-xs);
          font-weight: 700;
          letter-spacing: 0.08em;
          background: var(--color-info-light);
          color: var(--color-info);
        }

        .login-footer-text {
          text-align: center;
          margin-top: var(--space-6);
          font-size: var(--text-xs);
          color: var(--color-text-muted);
        }

        .login-spinner {
          display: inline-block;
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
