// Servicio para gestionar las operaciones relacionadas con sonidos
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

/**
 * Servicio para gestionar las operaciones con sonidos
 */
class SoundService {
  /**
   * Obtiene todos los sonidos disponibles
   */
  async getAllSounds() {
    try {
      const response = await axios.get(`${API_URL}/sounds`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener sonidos:', error);
      throw error;
    }
  }

  /**
   * Obtiene solo los sonidos institucionales
   */
  async getInstitutionalSounds() {
    try {
      const response = await axios.get(`${API_URL}/sounds/institutional`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener sonidos institucionales:', error);
      throw error;
    }
  }

  /**
   * Obtiene un sonido específico por su ID
   */
  async getSoundById(soundId) {
    try {
      const response = await axios.get(`${API_URL}/sounds/${soundId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener el sonido con ID ${soundId}:`, error);
      throw error;
    }
  }

  /**
   * Sube un nuevo archivo de sonido
   */
  async uploadSound(formData) {
    try {
      const response = await axios.post(`${API_URL}/sounds/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error al subir el sonido:', error);
      throw error;
    }
  }

  /**
   * Actualiza un sonido existente
   */
  async updateSound(soundId, formData) {
    try {
      // Debug: Verificar los datos antes de enviarlos
      console.log('SoundService.updateSound - FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }
      
      // Don't set Content-Type header, let axios set it with the boundary
      const response = await axios.put(`${API_URL}/sounds/${soundId}`, formData);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar el sonido con ID ${soundId}:`, error);
      throw error;
    }
  }

  /**
   * Elimina un sonido por su ID
   */
  async deleteSound(soundId) {
    try {
      const response = await axios.delete(`${API_URL}/sounds/${soundId}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar el sonido con ID ${soundId}:`, error);
      throw error;
    }
  }
}

export default new SoundService();