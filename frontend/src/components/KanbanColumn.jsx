import React, { useState } from 'react';
import TaskCard from './TaskCard';
import { Inbox } from 'lucide-react';

const KanbanColumn = ({
  column,
  tasks,
  onTaskDrop,
  onEditTask,
  onDeleteTask,
  activeDragTaskId,
  setActiveDragTaskId,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) {
      setIsDragOver(true);
    }
  };

  const handleDragLeave = (e) => {
    // Only reset if leaving the column element itself
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const taskId = e.dataTransfer.getData('text/plain') || activeDragTaskId;
    if (taskId) {
      onTaskDrop(taskId, column.id);
    }
  };

  return (
    <div
      id={`kanban-col-${column.id}`}
      className={`kanban-column ${isDragOver ? 'drag-over' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-header">
        <div className="column-title-group">
          <span
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              backgroundColor: column.color,
            }}
          />
          <h3 className="column-title">{column.label}</h3>
        </div>
        <span className="column-count-badge" id={`badge-count-${column.id}`}>
          {tasks.length}
        </span>
      </div>

      <div className="column-task-list">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onDragStart={(id) => setActiveDragTaskId(id)}
              onDragEnd={() => setActiveDragTaskId(null)}
            />
          ))
        ) : (
          <div className="empty-column-state">
            <Inbox size={28} strokeWidth={1.5} style={{ marginBottom: '8px', opacity: 0.6 }} />
            <p>No tasks here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
