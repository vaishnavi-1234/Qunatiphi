import React, { useState, useEffect } from 'react';
import { X, Edit2, AlertCircle } from 'lucide-react';
import { PRIORITIES, STATUSES } from '../utils/constants';

const EditTaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  projectMembers = [],
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(PRIORITIES.MEDIUM);
  const [status, setStatus] = useState(STATUSES.TODO);
  const [dueDate, setDueDate] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setPriority(task.priority || PRIORITIES.MEDIUM);
      setStatus(task.status || STATUSES.TODO);
      setDueDate(
        task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
      );
      setAssignedTo(task.assignedTo?._id || task.assignedTo || '');
      setError('');
    }
  }, [task]);

  if (!isOpen || !task) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onSubmit(task._id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        dueDate: dueDate || null,
        assignedTo: assignedTo || null,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update task');
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
              <Edit2 size={16} strokeWidth={2.5} />
            </div>
            <h3 className="modal-title">Edit Task</h3>
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
              <label className="form-label" htmlFor="edit-task-title">
                Task Title *
              </label>
              <input
                id="edit-task-title"
                className="form-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="edit-task-description">
                Description
              </label>
              <textarea
                id="edit-task-description"
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-task-priority">
                  Priority *
                </label>
                <select
                  id="edit-task-priority"
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value={PRIORITIES.LOW}>Low</option>
                  <option value={PRIORITIES.MEDIUM}>Medium</option>
                  <option value={PRIORITIES.HIGH}>High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-task-status">
                  Status Column *
                </label>
                <select
                  id="edit-task-status"
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value={STATUSES.TODO}>To-Do</option>
                  <option value={STATUSES.IN_PROGRESS}>In Progress</option>
                  <option value={STATUSES.DONE}>Done</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="edit-task-duedate">
                  Due Date
                </label>
                <input
                  id="edit-task-duedate"
                  className="form-input"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="edit-task-assignee">
                  Assigned User
                </label>
                <select
                  id="edit-task-assignee"
                  className="form-select"
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                >
                  <option value="">Unassigned</option>
                  {projectMembers.map((member) => (
                    <option key={member._id || member.userId} value={member._id || member.userId}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>
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
              id="submit-edit-task"
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
