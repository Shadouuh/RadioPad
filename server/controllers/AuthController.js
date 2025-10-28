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

            const token = generateToken({
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
            });

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

            const token = generateToken({
                user_id: result.user_id,
                name: result.name,
                email: result.email,
                role: result.role,
            });

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
}

export default AuthController;
