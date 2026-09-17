import React, { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import { STATUS_COLUMNS, STATUSES } from '../utils/constants';

const KanbanBoard = ({
  tasks,
  onMoveTask,
  onEditTask,
  onDeleteTask,
}) => {
  const [activeDragTaskId, setActiveDragTaskId] = useState(null);

  const getTasksByStatus = (status) => {
    return tasks.filter((t) => t.status === status);
  };

  const handleTaskDrop = async (taskId, targetStatus) => {
    const task = tasks.find((t) => t._id === taskId);
    if (!task) return;

    // If dropped in the same column, do nothing
    if (task.status === targetStatus) return;

    try {
      await onMoveTask(taskId, targetStatus);
    } catch (err) {
      console.error('Error dropping task into column:', err);
    }
  };

  return (
    <div className="board-container" id="kanban-board">
      {STATUS_COLUMNS.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          tasks={getTasksByStatus(column.id)}
          onTaskDrop={handleTaskDrop}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          activeDragTaskId={activeDragTaskId}
          setActiveDragTaskId={setActiveDragTaskId}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
