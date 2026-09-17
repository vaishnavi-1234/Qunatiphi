import React, { useState } from 'react';
import { X, FolderPlus, AlertCircle } from 'lucide-react';

const CreateProjectModal = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Project name is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit({
        name: name.trim(),
        description: description.trim(),
      });
      setName('');
      setDescription('');
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6366f1',
              }}
            >
              <FolderPlus size={18} strokeWidth={2.5} />
            </div>
            <h3 className="modal-title">Create New Project</h3>
          </div>
          <button className="card-icon-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid #ef4444',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.65rem 0.85rem',
                  fontSize: '0.84rem',
                  color: '#fca5a5',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <div className="form-group">
              <label className="form-label" htmlFor="project-name">
                Project Name *
              </label>
              <input
                id="project-name"
                className="form-input"
                type="text"
                placeholder="e.g. Mobile App Redesign"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="project-desc">
                Description
              </label>
              <textarea
                id="project-desc"
                className="form-textarea"
                placeholder="Briefly describe the project goals..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>
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
              id="submit-create-project"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
