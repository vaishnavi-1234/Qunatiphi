import api from './api';

export const userService = {
  async getAllUsers(search = '') {
    const params = search ? { search } : {};
    const response = await api.get('/users', { params });
    return response.data;
  },

  async getUserById(id) {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
};

export default userService;
