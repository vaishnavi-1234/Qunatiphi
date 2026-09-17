import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const DeleteConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Task',
  message = 'Are you sure you want to delete this task? This action cannot be undone.',
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        style={{ maxWidth: '440px' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ef4444',
              }}
            >
              <AlertTriangle size={18} />
            </div>
            <h3 className="modal-title">{title}</h3>
          </div>
          <button className="card-icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.5 }}>
            {message}
          </p>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            type="button"
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
