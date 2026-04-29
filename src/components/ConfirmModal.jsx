import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Confirm', danger = false }) {
  const [verification, setVerification] = useState('');

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (danger && verification !== 'CONFIRM') return;
    onConfirm();
    setVerification('');
  };

  const handleClose = () => {
    setVerification('');
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
          {danger && (
            <div style={{
              width: 40, height: 40, borderRadius: 'var(--radius-md)',
              background: 'var(--color-danger-light)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
              <AlertTriangle size={20} style={{ color: 'var(--color-danger)' }} />
            </div>
          )}
          <h3 className="modal-title" style={{ margin: 0 }}>{title}</h3>
        </div>

        <div className="modal-body">{message}</div>

        {danger && (
          <div className="form-group">
            <label className="form-label">Ketik <strong style={{ color: 'var(--color-danger)' }}>CONFIRM</strong> untuk melanjutkan</label>
            <input
              className="input"
              value={verification}
              onChange={e => setVerification(e.target.value)}
              placeholder="CONFIRM"
            />
          </div>
        )}

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={handleClose}>Cancel</button>
          <button
            className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`}
            onClick={handleConfirm}
            disabled={danger && verification !== 'CONFIRM'}
            style={{ opacity: danger && verification !== 'CONFIRM' ? 0.5 : 1 }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
