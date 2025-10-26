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

-- Reactivar verificación de claves foráneas
SET FOREIGN_KEY_CHECKS=1;

-- Ejemplos de inserciones para las tablas

-- Inserciones para sound_categories
INSERT INTO sound_categories (category_name, description) VALUES 
('Efectos de ambiente', 'Sonidos ambientales como lluvia, viento, multitudes'),
('Jingles', 'Melodías cortas para transiciones'),
('Efectos especiales', 'Sonidos para momentos dramáticos o cómicos'),
('Música de fondo', 'Pistas musicales para usar como fondo');

-- Inserciones para sound_effects (asumiendo que existen usuarios en la tabla users)
-- Nota: Ajustar created_by con IDs válidos de la tabla users
INSERT INTO sound_effects (sound_name, description, file_path, duration_seconds, file_size, is_institutional, category_id) VALUES 
('Intro oficial', 'Introducción oficial de la radio', 'https://res.cloudinary.com/dbhly9c1j/video/upload/v1761440817/sounds/1761440815237-376919989_dg00y8.mp3', 15.5, 1024000, TRUE, 2),
('Efecto de lluvia', 'Sonido de lluvia suave', 'https://res.cloudinary.com/dbhly9c1j/video/upload/v1761440817/sounds/1761440815237-376919989_dg00y8.mp3' 60.0, 2048000, FALSE, 1),
('Risas', 'Efecto de risas para momentos cómicos', 'https://res.cloudinary.com/dbhly9c1j/video/upload/v1761440817/sounds/1761440815237-376919989_dg00y8.mp3', 3.2, 512000, FALSE, 3),
('Música jazz', 'Música de fondo estilo jazz', 'https://res.cloudinary.com/dbhly9c1j/video/upload/v1761440817/sounds/1761440815237-376919989_dg00y8.mp3', 120.0, 4096000, FALSE, 4),
('Despedida', 'Jingle de despedida del programa', 'https://res.cloudinary.com/dbhly9c1j/video/upload/v1761440817/sounds/1761440815237-376919989_dg00y8.mp3', 10.0, 1024000, TRUE, 2);

-- Inserciones para sound_collections (asumiendo que existen usuarios en la tabla users)
-- Nota: Ajustar created_by con IDs válidos de la tabla users
INSERT INTO sound_collections (collection_name, description) VALUES 
('Colección matutina', 'Sonidos para el programa de la mañana'),
('Efectos dramáticos', 'Colección de efectos para momentos de tensión'),
('Ambiente natural', 'Sonidos de la naturaleza');

-- Inserciones para collections_sounds
INSERT INTO collections_sounds (collection_id, sound_id) VALUES 
(1, 1), -- Intro oficial en Colección matutina
(1, 5), -- Despedida en Colección matutina
(2, 3), -- Risas en Efectos dramáticos
(3, 2); -- Efecto de lluvia en Ambiente natural

-- Inserciones para programs_sounds (asumiendo que existen programas en la tabla programs)
-- Nota: Ajustar program_id con IDs válidos de la tabla programs
INSERT INTO programs_sounds (program_id, sound_id) VALUES 
(1, 1), -- Programa 1 usa Intro oficial
(1, 4), -- Programa 1 usa Música jazz
(2, 2), -- Programa 2 usa Efecto de lluvia
(2, 3); -- Programa 2 usa Risas