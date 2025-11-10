import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import handleError from '../utils/handleError.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Crear directorio temporal si no existe
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro para archivos de audio
const audioFilter = (req, file, cb) => {
  const allowedTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(handleError(new Error('Formato de archivo no soportado. Solo se permiten archivos de audio (MP3, WAV, OGG)'), 'INVALID_FILE_TYPE', 400), false);
  }
};

// Middleware de multer para subida de archivos de audio
const uploadAudio = multer({
  storage: storage,
  fileFilter: audioFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  }
});

// Middleware para manejar archivos opcionales - permite que no haya archivo
const uploadOptionalFile = (req, res, next) => {
  const upload = uploadAudio.single('file');
  upload(req, res, function (err) {
    if (err) {
      return next(err);
    }
    // Si no hay error, continuar (incluyendo el caso donde no hay archivo)
    next();
  });
};

// Middleware para manejar errores de multer y procesar form data
export const handleUpload = (req, res, next) => {
  uploadOptionalFile(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // Error de Multer
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ 
          error: true, 
          message: 'El archivo es demasiado grande. Tamaño máximo: 10MB' 
        });
      }
      return res.status(400).json({ 
        error: true, 
        message: err.message 
      });
    } else if (err) {
      // Error personalizado o desconocido
      return res.status(err.statusCode || 500).json({ 
        error: true, 
        message: err.message || 'Error al subir el archivo' 
      });
    }
    // Multer should have processed the form fields now
    console.log('Multer middleware - File:', req.file);
    console.log('Multer middleware - Body:', req.body);
    next();
  });
};

// Middleware para limpiar archivos temporales después de subir a Cloudinary
export const cleanTempFiles = (req, res, next) => {
  // Se ejecuta después de que la respuesta ha sido enviada
  res.on('finish', () => {
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error al eliminar archivo temporal:', err);
      });
    }
  });
  next();
};
