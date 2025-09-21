import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_PATH = path.resolve(__dirname, '../../client/dist');
const ASSETS_PATH = path.join(DIST_PATH, 'assets');

const loadStaticFiles = (app) => {
  try {
    // Servir carpeta de assets estáticos
    app.use('/assets', express.static(ASSETS_PATH));

    // Servir todo dist
    app.use(express.static(DIST_PATH));

    // Fallback para SPA (sirve index.html)
    app.use((req, res, next) => {
      if (!req.path.startsWith('/api/')) {
        res.sendFile(path.join(DIST_PATH, 'index.html'));
      } else {
        next();
      }
    });

    console.log('✅ Sirviendo archivos estáticos desde:', DIST_PATH);
  } catch (error) {
    console.error('❌ Error al cargar archivos estáticos:', error);
  }
};

export default loadStaticFiles;