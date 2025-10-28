// Importaciones de rutas
import authRoutes from './routes/auth.js';
import soundRoutes from './routes/sound.js';
import programRoutes from './routes/program.js';
import userRoutes from './routes/user.js';

// Importaciones de dependencias 
import express from 'express';
import cors from 'cors';
import logger from './middlewares/logger.js';
import loadEnv from './utils/loadEnv.js';
import cookieParser from 'cookie-parser';
import loadStaticFiles from './utils/loadStaticsFiles.js'
// import { requireAuth, requireAdmin } from './middlewares/authMiddleware.js';

// Middlewares
const app = express();

app.use(express.json({ limit: '10mb' }));
app.use(cookieParser());

// Cargar variables de entorno
loadEnv();

// Validar entorno (Desarrollo o Produccion)
const isProduction = process.env.NODE_ENV === 'production';
if (!isProduction) {
    console.log('Modo de desarrollo')

    app.use(logger);
    app.use(cors({
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
        allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization'],
        credentials: true,
    }));
} else {
    console.log('Modo de produccion')
}

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/sounds', soundRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/users', userRoutes);

// Testeo de api
app.get('/api/ping', async (req, res) => {
    res.send('Pong')
});

// Servir archivos estaticos de la build de Vite
if (isProduction) loadStaticFiles(app);

// Prender servidor de solicitudes http 
const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`Server escuchando en el puerto ${port}`));