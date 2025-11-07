import handleError from '../utils/handleError.js';
import { generateToken } from '../utils/jwt.js';

class AuthController {
    constructor(authService) {
        this.authService = authService;
    }

    register = async (req, res) => {
        const { name, email, password } = req.body;
        try {
            if (!name || !email || !password) {
                throw { status: 400, message: 'Faltan datos para el registro' };
            }

            const user = await this.authService.registerUser({ name, email, password });

            const token = generateToken(user);

            res.cookie('token', token, {
                httpOnly: true,
                secure: true, // usar HTTPS en producción
                sameSite: 'Strict',
                maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            });

            res.status(201).json({
                success: true,
                message: 'Se registró correctamente',
                user: { ...user, pass: '[Hidden]' }
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    login = async (req, res) => {
        const { email, password } = req.body;
        try {
            if (!email || !password) {
                throw { status: 400, message: 'Faltan datos para el login' };
            }

            const result = await this.authService.loginUser({ email, password });

            console.log('=== DEBUG LOGIN ===');
            console.log('Datos del usuario para token:', result);
            console.log('program_id en resultado:', result.program_id);
            
            const token = generateToken(result);
            
            console.log('Token generado exitosamente');

            res.cookie('token', token, {
                httpOnly: true,
                secure: true, // usar HTTPS en producción
                sameSite: 'Strict',
                maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
            });

            res.status(200).json({
                success: true,
                message: 'Se inició sesión correctamente',
                user: result
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    logout = (req, res) => {
        res.clearCookie('token');
        res.status(200).json({
            success: true,
            message: 'Se cerró sesión correctamente',
        });
    };

    me = (req, res) => {
        
        res.status(200).json({
            success: true,
            message: 'Usuario autenticado',
            user: req.user
        });
    };

    // Configuracion 
    updatePreferences = async (req, res) => {
        const { soundEffects, notify, darkMode } = req.body;
        try {
            // Usamos el ID correcto del usuario desde req.user
            const updatedPrefs = await this.authService.updatePreferences({ 
                userId: req.user.user_id, 
                soundEffects, 
                notify, 
                darkMode 
            });

            // Actualizamos las preferencias en el objeto de usuario
            req.user.config = {
                effects_sounds: updatedPrefs.effects_sounds,
                notify: updatedPrefs.notify,
                dark_mode: updatedPrefs.dark_mode
            };

            res.status(200).json({
                success: true,
                message: 'Preferencias actualizadas correctamente',
                preferences: updatedPrefs
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    changePassword = async (req, res) => {
        const { currentPassword, newPassword } = req.body;
        try {
            if (!currentPassword || !newPassword) {
                throw { status: 400, message: 'Faltan datos para cambiar la contraseña' };
            }

            const result = await this.authService.changePassword({ userId: req.user.user_id, currentPassword, newPassword });

            res.status(200).json({
                success: true,
                message: result.message,
                user: { ...result }
            });
        } catch (err) {
            return handleError(res, err);
        }
    };
}

export default AuthController;
