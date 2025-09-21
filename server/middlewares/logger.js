// Funcion para debugear
const logger = (req, res, next) => {
    const now = new Date();
    // No es necesario mostrar los OPTIONS
    if (req.method === 'OPTIONS') return next();
    console.log(`[${now.toLocaleTimeString()}] ${req.method} ${req.url}`);
    // Las request GET no tienen body
    if (req.method !== 'GET') console.log('body:', req.body);
    // Token
    // console.log('token:', req.headers.authorization);
    next();
}

export default logger;