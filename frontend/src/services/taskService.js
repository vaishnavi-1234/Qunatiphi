import api from './api';

export const taskService = {
  async getTasks(params) {
    const response = await api.get('/tasks', { params });
    return response.data;
  },

  async getTaskById(id) {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },

  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  async updateTask(id, taskData) {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  },

  async patchTaskStatus(id, status) {
    const response = await api.patch(`/tasks/${id}/status`, { status });
    return response.data;
  },

  async patchTaskAssign(id, assignedTo) {
    const response = await api.patch(`/tasks/${id}/assign`, { assignedTo });
    return response.data;
  },
};

export default taskService;
