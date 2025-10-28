import bcrypt from 'bcrypt';

class AuthService {
    constructor(conex) {
        this.conex = conex
    }

    hashPassword = async (password) => {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    };

    comparePassword = async (password, hashedPassword) => {
        return await bcrypt.compare(password, hashedPassword);
    };

    registerUser = async (userData) => {
        try {
            const { name, email, password, role } = userData;
            const normalizedEmail = email.toLowerCase().trim();

            const hashedPassword = await this.hashPassword(password);

            const [result] = await this.conex.query(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, normalizedEmail, hashedPassword, role]
            );

            return {
                user_id: result.insertId,
                name: name,
                email: normalizedEmail,
                role: role,
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
            const normalizedEmail = email.toLowerCase().trim();

            const [users] = await this.conex.query(
                'SELECT * FROM users WHERE email = ? AND active = 1',
                [normalizedEmail]
            );

            if (users.length === 0) {
                throw { status: 401, message: 'Credenciales incorrectas o cuenta desactivada' };
            }

            const user = users[0];

            // Verificar si la cuenta está bloqueada
            if (user.lock_until && new Date() < new Date(user.lock_until)) {
                throw { status: 423, message: 'Cuenta bloqueada temporalmente. Intenta más tarde.' };
            }

            const isPasswordValid = await this.comparePassword(password, user.password);

            if (!isPasswordValid) {
                // Incrementar intentos fallidos
                const newFailedAttempts = (user.failed_attempts || 0) + 1;
                let lockedUntil = null;

                if (newFailedAttempts >= 5) {
                    lockedUntil = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
                }

                await this.conex.query(
                    'UPDATE users SET failed_attempts = ?, lock_until = ? WHERE user_id = ?',
                    [newFailedAttempts, lockedUntil, user.user_id]
                );

                throw { status: 401, message: 'Credenciales incorrectas' };
            }

            // Resetear intentos fallidos en users exitoso
            await this.conex.query(
                'UPDATE users SET failed_attempts = 0, lock_until = NULL WHERE user_id = ?',
                [user.user_id]
            );

            return {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
            }
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error interno del servidor', cause: error };
        }
    };
}

export default AuthService;
