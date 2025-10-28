import axios from '../api/axios';

class UserService {
  // Obtener todos los usuarios
  static async getAllUsers() {
    try {
      const response = await axios.get('/users');

      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un usuario por ID
  static async getUserById(id) {
    try {
      const response = await axios.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo usuario
  static async createUser(userData) {
    try {
      const response = await axios.post('/users', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un usuario
  static async updateUser(id, userData) {
    try {
      const response = await axios.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un usuario (soft delete)
  static async deleteUser(id) {
    try {
      const response = await axios.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Desactivar un usuario (soft delete)
  static async toggleUser(id) {
    try {
      const response = await axios.patch(`/users/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Obtener usuarios por rol
  static async getUsersByRole(role) {
    try {
      const response = await axios.get(`/users/role/${role}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default UserService;