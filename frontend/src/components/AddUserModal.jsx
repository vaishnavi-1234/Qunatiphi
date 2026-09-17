import React, { useState, useEffect } from 'react';
import { X, UserPlus, Search, Check, AlertCircle } from 'lucide-react';
import userService from '../services/userService';

const AddUserModal = ({ isOpen, onClose, onAddMember, currentMembers = [] }) => {
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadUsers();
    }
  }, [isOpen]);

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await userService.getAllUsers();
      if (res.success) {
        // Exclude users already members of this project
        const currentMemberIds = new Set(
          currentMembers.map((m) => m._id || m.userId)
        );
        const filtered = res.data.filter((u) => !currentMemberIds.has(u._id));
        setAvailableUsers(filtered);
        if (filtered.length > 0) {
          setSelectedUserId(filtered[0]._id);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId) {
      setError('Please select a user to add');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onAddMember(selectedUserId);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member to project');
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibleUsers = availableUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <UserPlus size={18} strokeWidth={2.5} />
            </div>
            <h3 className="modal-title">Add Member to Project</h3>
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

            <div style={{ position: 'relative' }}>
              <Search
                size={16}
                color="#64748b"
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                className="form-input"
                style={{ paddingLeft: '36px', width: '100%' }}
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
                Loading registered users...
              </p>
            ) : availableUsers.length === 0 ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1rem' }}>
                All registered users are already members of this project.
              </p>
            ) : (
              <div
                style={{
                  maxHeight: '220px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                  paddingRight: '4px',
                }}
              >
                {visibleUsers.map((u) => {
                  const isSelected = selectedUserId === u._id;
                  return (
                    <div
                      key={u._id}
                      onClick={() => setSelectedUserId(u._id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: isSelected ? 'rgba(79, 70, 229, 0.18)' : 'var(--bg-card)',
                        border: `1px solid ${isSelected ? 'var(--primary)' : 'var(--border-subtle)'}`,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={
                            u.avatar ||
                            `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                              u.name
                            )}`
                          }
                          alt={u.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%' }}
                        />
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                            {u.name}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            {u.email}
                          </div>
                        </div>
                      </div>
                      {isSelected && <Check size={16} color="#6366f1" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              id="submit-add-member"
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting || !selectedUserId || availableUsers.length === 0}
            >
              {isSubmitting ? 'Adding...' : 'Add to Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserModal;
