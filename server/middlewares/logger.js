// Middleware de logging (controlado por variables de entorno)
// REQUEST_LOGS: habilita/deshabilita el log por request (default: true)
// LOG_REQUEST_BODY: muestra el body en métodos no-GET (default: false)
const logger = (req, res, next) => {
    const ENABLE_REQUEST_LOGS = process.env.REQUEST_LOGS !== 'false';
    const LOG_REQUEST_BODY = process.env.LOG_REQUEST_BODY === 'true';

    if (!ENABLE_REQUEST_LOGS) return next();

    const now = new Date();
    // No es necesario mostrar los OPTIONS
    if (req.method === 'OPTIONS') return next();

    console.log(`[${now.toLocaleTimeString()}] ${req.method} ${req.url}`);

    if (LOG_REQUEST_BODY && req.method !== 'GET') {
        console.log('body:', req.body);
    }

    next();
}

export default logger;