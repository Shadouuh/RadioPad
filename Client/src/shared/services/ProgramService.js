import axios from '../api/axios';

class ProgramService {
  // ===== GESTIÓN DE PROGRAMAS =====
  
  // Obtener todos los programas
  static async getAllPrograms() {
    try {
      const response = await axios.get('/programs');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Obtener programas del usuario autenticado
  static async getUserPrograms() {
    try {
      const response = await axios.get('/programs/user/my-programs');
      return response.data;
    } catch (error) {
      console.error('Error al obtener programas del usuario:', error);
      throw error;
    }
  }

  // Obtener un programa por ID
  static async getProgramById(id) {
    try {
      const response = await axios.get(`/programs/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Crear un nuevo programa
  static async createProgram(programData) {
    try {
      const response = await axios.post('/programs', programData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un programa
  static async updateProgram(id, programData) {
    try {
      const response = await axios.put(`/programs/${id}`, programData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un programa
  static async deleteProgram(id) {
    try {
      const response = await axios.delete(`/programs/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Alternar estado activo/inactivo de un programa
  static async toggleProgramStatus(id) {
    try {
      const response = await axios.patch(`/programs/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ===== GESTIÓN DE SONIDOS DE PROGRAMAS =====

  // Crear un sonido asociado a un programa
  static async createProgramSound(programId, soundData) {
    try {
      const response = await axios.post(`/sounds/program/${programId}`, soundData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Obtener sonidos de un programa específico
  static async getProgramSounds(programId) {
    try {
      const response = await axios.get(`/sounds/program/${programId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Obtener un sonido específico de un programa
  static async getProgramSoundById(programId, soundId) {
    try {
      const response = await axios.get(`/sounds/program/${programId}/${soundId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Actualizar un sonido de un programa
  static async updateProgramSound(soundId, soundData) {
    try {
      const response = await axios.put(`/sounds/program-sound/${soundId}`, soundData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un sonido de un programa
  static async deleteProgramSound(soundId) {
    try {
      const response = await axios.delete(`/sounds/program-sound/${soundId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // ===== GESTIÓN DE SONIDOS GENERALES =====

  // Subir un archivo de sonido
  static async uploadSound(formData) {
    try {
      const response = await axios.post('/sounds/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Obtener todos los sonidos disponibles
  static async getAllSounds() {
    try {
      const response = await axios.get('/sounds');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Obtener sonidos institucionales
  static async getInstitutionalSounds() {
    try {
      const response = await axios.get('/sounds/institutional');
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Obtener información de un sonido específico
  static async getSoundInfo(soundId) {
    try {
      const response = await axios.get(`/sounds/${soundId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  // Eliminar un sonido
  static async deleteSound(soundId) {
    try {
      const response = await axios.delete(`/program-sound/${soundId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default ProgramService;