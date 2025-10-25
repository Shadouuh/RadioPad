CREATE DATABASE IF NOT EXISTS bdtecniestockprueba;
USE bdtecniestockprueba;

-- Desactivar verificación de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS=0;

-- Tabla de categorías de sonido
CREATE TABLE IF NOT EXISTS sound_categories (
  category_id INT AUTO_INCREMENT PRIMARY KEY,
  category_name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de efectos de sonido
CREATE TABLE IF NOT EXISTS sound_effects (
  sound_id INT AUTO_INCREMENT PRIMARY KEY,
  sound_name VARCHAR(100) NOT NULL,
  description TEXT,
  file_path VARCHAR(255) NOT NULL,
  duration_seconds FLOAT,
  file_size INT,
  is_institutional BOOLEAN DEFAULT FALSE,
  category_id INT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES sound_categories(category_id) ON DELETE SET NULL,
  FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Tabla de colecciones de sonidos
CREATE TABLE IF NOT EXISTS sound_collections (
  collection_id INT AUTO_INCREMENT PRIMARY KEY,
  collection_name VARCHAR(100) NOT NULL,
  description TEXT,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Tabla intermedia para relacionar colecciones con sonidos
CREATE TABLE IF NOT EXISTS collections_sounds (
  collection_sound_id INT AUTO_INCREMENT PRIMARY KEY,
  collection_id INT NOT NULL,
  sound_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (collection_id) REFERENCES sound_collections(collection_id) ON DELETE CASCADE,
  FOREIGN KEY (sound_id) REFERENCES sound_effects(sound_id) ON DELETE CASCADE,
  UNIQUE KEY unique_collection_sound (collection_id, sound_id)
);

-- Tabla intermedia para relacionar programas con sonidos 
CREATE TABLE IF NOT EXISTS programs_sounds (
  program_sound_id INT AUTO_INCREMENT PRIMARY KEY,
  program_id INT NOT NULL,
  sound_id INT NOT NULL,
  added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (program_id) REFERENCES programs(program_id) ON DELETE CASCADE,
  FOREIGN KEY (sound_id) REFERENCES sound_effects(sound_id) ON DELETE CASCADE,
  UNIQUE KEY unique_program_sound (program_id, sound_id)
);

-- Índices
CREATE INDEX idx_sound_effects_category ON sound_effects(category_id);
CREATE INDEX idx_sound_effects_institutional ON sound_effects(is_institutional);
CREATE INDEX idx_sound_effects_created_by ON sound_effects(created_by);
CREATE INDEX idx_collections_sounds_collection ON collections_sounds(collection_id);
CREATE INDEX idx_collections_sounds_sound ON collections_sounds(sound_id);
CREATE INDEX idx_programs_sounds_program ON programs_sounds(program_id);
CREATE INDEX idx_programs_sounds_sound ON programs_sounds(sound_id);