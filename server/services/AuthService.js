import bcrypt from 'bcrypt';

class AuthService {
    constructor(conex) {
        this.conex = conex
    }

    normalizeEmail = (email) => {
        return email.toLowerCase().trim();
    };

    hashPassword = async (password) => {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    };

    comparePassword = async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword);
    };

    registerUser = async (userData) => {
        try {
            const { name, email, password } = userData;
            const normalizedEmail = this.normalizeEmail(email);

            const hashedPassword = await this.hashPassword(password);

            const [result] = await this.conex.query(
                'INSERT INTO login (name, email, pass) VALUES (?, ?, ?)',
                [name, normalizedEmail, hashedPassword]
            );

            return {
                id_login: result.insertId,
                name: name,
                email: normalizedEmail,
                active: true,
                is_admin: false,
            }

        } catch (error) {
            if (error.status) throw error;
            if (error.code === 'ER_DUP_ENTRY') {
                throw { status: 409, message: 'El correo electrónico ya está registrado' };
            }
            throw { status: 500, message: 'Error interno del servidor', cause: error };
        }
    };

    loginUser = async (credentials) => {
        try {
            const { email, password } = credentials;
            const normalizedEmail = this.normalizeEmail(email);

            const [login] = await this.conex.query(
                'SELECT * FROM login WHERE email = ? AND active = 1',
                [normalizedEmail]
            );

            if (login.length === 0) {
                throw { status: 401, message: 'Credenciales incorrectas o cuenta desactivada' };
            }

            const user = login[0];

            // Verificar si la cuenta está bloqueada
            if (user.lock_until && new Date() < new Date(user.lock_until)) {
                throw { status: 423, message: 'Cuenta bloqueada temporalmente. Intenta más tarde.' };
            }

            const isPasswordValid = await this.comparePassword(password, user.pass);

            if (!isPasswordValid) {
                // Incrementar intentos fallidos
                const newFailedAttempts = (user.failed_attempts || 0) + 1;
                let lockedUntil = null;

                if (newFailedAttempts >= 5) {
                    lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
                }

                await this.conex.query(
                    'UPDATE login SET failed_attempts = ?, lock_until = ? WHERE id_login = ?',
                    [newFailedAttempts, lockedUntil, user.id_login]
                );

                throw { status: 401, message: 'Credenciales incorrectas' };
            }

            // Resetear intentos fallidos en login exitoso
            await this.conex.query(
                'UPDATE login SET failed_attempts = 0, lock_until = NULL WHERE id_login = ?',
                [user.id_login]
            );

            return {
                id_login: user.id_login,
                name: user.name,
                email: user.email,
                active: user.active,
                is_admin: user.is_admin,
            }
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error interno del servidor', cause: error };
        }
    };
}

export default AuthService;
