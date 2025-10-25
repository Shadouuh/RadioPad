import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes.js';
import programRoutes from './routes/programRoutes.js';
import userProgramRoutes from './routes/userProgramRoutes.js';

dotenv.config();

// Inicializar aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Inicializar Prisma Client
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para hacer disponible prisma en las rutas
app.use((req, res, next) => {
  req.prisma = prisma;
  next();
});

// Rutas básicas
app.get('/', (req, res) => {
  res.json({ message: 'Bienvenido a la API de RadioPad' });
});

// Usar rutas
app.use('/api/users', userRoutes);
app.use('/api/programs', programRoutes);
app.use('/api/user-programs', userProgramRoutes);

// Middleware para manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Ha ocurrido un error en el servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de cierre de la aplicación
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  server.close(() => {
    console.log('Servidor cerrado');
    process.exit(0);
  });
});

export default app;