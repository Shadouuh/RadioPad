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

  // Crear un sonido asociado a un programa
  async createProgramSound(soundData) {
    try {
      const { 
        name, 
        description, 
        duration, 
        category, 
        file_url, 
        program_id 
      } = soundData;
      
      const [result] = await pool.query(
        `INSERT INTO sounds 
        (name, description, duration, category, file_url, program_id, created_at) 
        VALUES (?, ?, ?, ?, ?, ?, NOW())`,
        [name, description, duration, category, file_url, program_id]
      );
      
      return {
        id: result.insertId,
        name,
        description,
        duration,
        category,
        file_url,
        program_id
      };
    } catch (error) {
      throw {status: 500, message: 'Error al crear el sonido del programa'};
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

  // Obtener sonidos de un programa específico
  async getSoundsByProgram(programId) {
    try {
      const [sounds] = await pool.query(
        'SELECT * FROM sounds WHERE program_id = ? ORDER BY created_at ASC', 
        [programId]
      );
      return sounds;
    } catch (error) {
      throw {status: 500, message: 'Error al obtener los sonidos del programa'};
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

  // Obtener un sonido de programa por ID
  async getProgramSoundById(soundId) {
    try {
      const [sounds] = await pool.query('SELECT * FROM sounds WHERE id = ?', [soundId]);
      
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

  // Actualizar un sonido de programa
  async updateProgramSound(soundId, soundData) {
    try {
      const { name, description, duration, category, file_url } = soundData;
      
      const [result] = await pool.query(
        'UPDATE sounds SET name = ?, description = ?, duration = ?, category = ?, file_url = ? WHERE id = ?',
        [name, description, duration, category, file_url, soundId]
      );
      
      if (result.affectedRows === 0) {
        throw {status: 404, message: 'El sonido que intenta actualizar no existe'};
      }
      
      return await this.getProgramSoundById(soundId);
    } catch (error) {
      if (error.status) {
        throw error;
      }
      throw {status: 500, message: 'Error al actualizar el sonido'};
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

  // Eliminar un sonido de programa por ID
  async deleteProgramSound(soundId) {
    try {
      const [result] = await pool.query('DELETE FROM sounds WHERE id = ?', [soundId]);
      
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