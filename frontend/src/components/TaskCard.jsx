import React from 'react';
import { Calendar, AlertCircle, Edit2, Trash2, User } from 'lucide-react';
import { PRIORITIES } from '../utils/constants';

const TaskCard = ({ task, onEdit, onDelete, onDragStart, onDragEnd }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task._id);
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) onDragStart(task._id);
  };

  const handleDragEnd = (e) => {
    if (onDragEnd) onDragEnd();
  };

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'done';

  const priorityClass =
    task.priority === PRIORITIES.HIGH
      ? 'high'
      : task.priority === PRIORITIES.MEDIUM
      ? 'medium'
      : 'low';

  return (
    <div
      id={`task-card-${task._id}`}
      className="task-card"
      draggable={true}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
        <h4 className="task-card-title">{task.title}</h4>
        <div className="card-actions-btn-group">
          <button
            className="card-icon-btn"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            title="Edit Task"
            aria-label="Edit Task"
          >
            <Edit2 size={13} />
          </button>
          <button
            className="card-icon-btn delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task);
            }}
            title="Delete Task"
            aria-label="Delete Task"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {task.description && <p className="task-card-desc">{task.description}</p>}

      <div className="task-card-footer">
        <div className="task-meta-left">
          <span className={`priority-badge ${priorityClass}`}>
            <AlertCircle size={11} strokeWidth={2.5} />
            {task.priority}
          </span>

          {task.dueDate && (
            <span className={`due-date-pill ${isOverdue ? 'overdue' : ''}`}>
              <Calendar size={12} />
              {formatDueDate(task.dueDate)}
            </span>
          )}
        </div>

        <div>
          {task.assignedTo ? (
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
              title={`Assigned to ${task.assignedTo.name}`}
            >
              <img
                src={
                  task.assignedTo.avatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    task.assignedTo.name
                  )}`
                }
                alt={task.assignedTo.name}
                className="card-assignee-avatar"
              />
              <span
                style={{
                  fontSize: '0.74rem',
                  color: 'var(--text-secondary)',
                  maxWidth: '75px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {task.assignedTo.name}
              </span>
            </div>
          ) : (
            <span
              style={{
                fontSize: '0.72rem',
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
              }}
              title="Unassigned"
            >
              <User size={12} /> Unassigned
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
