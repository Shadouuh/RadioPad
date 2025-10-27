import pool from '../db/conex.js';
// Servicio para gestionar operaciones con sonidos en la base de datos
class SoundService {
  
  // Crear un nuevo sonido en la base de datos
  async createSound(soundData) {
    try {
      const { 
        sound_name, 
        description, 
        file_path, 
        duration_seconds, 
        file_size, 
        is_institutional = false, 
        category_id = null, 
        created_by 
      } = soundData;
      
      const [result] = await pool.query(
        `INSERT INTO sound_effects 
        (sound_name, description, file_path, duration_seconds, file_size, is_institutional, category_id, created_by) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [sound_name, description, file_path, duration_seconds, file_size, is_institutional, category_id, created_by]
      );
      
      return {
        sound_id: result.insertId,
        ...soundData
      };
    } catch (error) {
      throw {status: 500, message: 'Error al crear el sonido en la base de datos'};
    }
  }
  
  // Obtener todos los sonidos
  async getAllSounds() {
    try {
      const [sounds] = await pool.query('SELECT * FROM sound_effects');
      return sounds;
    } catch (error) {
      throw {status: 500, message: 'Error al obtener los sonidos'};
    }
  }
  
  // Obtener un sonido por ID
  async getSoundById(soundId) {
    try {
      const [sounds] = await pool.query('SELECT * FROM sound_effects WHERE sound_id = ?', [soundId]);
      
      if (sounds.length === 0) {
        throw {status: 404, message: 'El sonido solicitado no existe'};
      }
      
      return sounds[0];
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw {status: 500, message: 'Error al obtener el sonido'};
    }
  }
  
  // Eliminar un sonido por ID
  async deleteSound(soundId) {
    try {
      const [result] = await pool.query('DELETE FROM sound_effects WHERE sound_id = ?', [soundId]);
      
      if (result.affectedRows === 0) {
        throw {status: 404, message: 'El sonido que intenta eliminar no existe'};
      }
      
      return { deleted: true, sound_id: soundId };
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw {status: 500, message: 'Error al eliminar el sonido'};
    }
  }
  
  // Obtener sonidos institucionales
  async getInstitutionalSounds() {
    try {
      const [sounds] = await pool.query('SELECT * FROM sound_effects WHERE is_institutional = TRUE');
      return sounds;
    } catch (error) {
      throw {status: 500, message: 'Error al obtener los sonidos institucionales'};
    }
  }
}

export default new SoundService();