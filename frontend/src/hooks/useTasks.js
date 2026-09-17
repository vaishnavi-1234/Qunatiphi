import { useState, useEffect, useCallback } from 'react';
import taskService from '../services/taskService';
import projectService from '../services/projectService';

export const useTasks = (projectId) => {
  const [tasks, setTasks] = useState([]);
  const [workload, setWorkload] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterPriority, setFilterPriority] = useState('All');

  const fetchTasksAndWorkload = useCallback(async () => {
    if (!projectId) {
      setTasks([]);
      setWorkload([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const [tasksRes, workloadRes] = await Promise.all([
        taskService.getTasks({ project: projectId }),
        projectService.getProjectWorkload(projectId),
      ]);

      if (tasksRes.success) {
        setTasks(tasksRes.data);
      }
      if (workloadRes.success) {
        setWorkload(workloadRes.data);
      }
    } catch (err) {
      console.error('Error fetching tasks or workload:', err);
      setError(err.response?.data?.message || 'Failed to load task board');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchTasksAndWorkload();
  }, [fetchTasksAndWorkload]);

  // Refresh workload independently
  const refreshWorkload = useCallback(async () => {
    if (!projectId) return;
    try {
      const res = await projectService.getProjectWorkload(projectId);
      if (res.success) {
        setWorkload(res.data);
      }
    } catch (err) {
      console.error('Failed to refresh workload:', err);
    }
  }, [projectId]);

  // Move task (Drag & Drop) with optimistic update
  const moveTask = async (taskId, newStatus) => {
    const previousTasks = [...tasks];

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      const res = await taskService.patchTaskStatus(taskId, newStatus);
      if (res.success && res.data) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? res.data : t))
        );
        // Requirement 17 & 37: Workload status must recalculate immediately when a task moves
        await refreshWorkload();
        return res.data;
      }
    } catch (err) {
      console.error('Failed to update task status:', err);
      // Revert on error
      setTasks(previousTasks);
      throw err;
    }
  };

  // Reassign task
  const reassignTask = async (taskId, newUserId) => {
    try {
      const res = await taskService.patchTaskAssign(taskId, newUserId);
      if (res.success && res.data) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? res.data : t))
        );
        await refreshWorkload();
        return res.data;
      }
    } catch (err) {
      console.error('Failed to reassign task:', err);
      throw err;
    }
  };

  // Create task
  const createTask = async (taskData) => {
    try {
      const res = await taskService.createTask({
        ...taskData,
        project: projectId,
      });
      if (res.success && res.data) {
        setTasks((prev) => [res.data, ...prev]);
        await refreshWorkload();
        return res.data;
      }
    } catch (err) {
      console.error('Failed to create task:', err);
      throw err;
    }
  };

  // Update task
  const updateTask = async (taskId, taskData) => {
    try {
      const res = await taskService.updateTask(taskId, taskData);
      if (res.success && res.data) {
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? res.data : t))
        );
        await refreshWorkload();
        return res.data;
      }
    } catch (err) {
      console.error('Failed to update task:', err);
      throw err;
    }
  };

  // Delete task
  const deleteTask = async (taskId) => {
    try {
      const res = await taskService.deleteTask(taskId);
      if (res.success) {
        setTasks((prev) => prev.filter((t) => t._id !== taskId));
        await refreshWorkload();
        return true;
      }
    } catch (err) {
      console.error('Failed to delete task:', err);
      throw err;
    }
  };

  // Filter tasks based on priority
  const filteredTasks = tasks.filter((task) => {
    if (filterPriority === 'All') return true;
    return task.priority === filterPriority;
  });

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    workload,
    loading,
    error,
    filterPriority,
    setFilterPriority,
    fetchTasksAndWorkload,
    refreshWorkload,
    moveTask,
    reassignTask,
    createTask,
    updateTask,
    deleteTask,
  };
};

export default useTasks;
