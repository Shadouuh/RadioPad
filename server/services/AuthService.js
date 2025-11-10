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

            const [user] = await this.conex.query(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, normalizedEmail, hashedPassword, role]
            );

            const [config] = await this.conex.query(
                'INSERT INTO config (user_id) VALUES (?)',
                [user.insertId]
            );

            // Obtener programas asignados al usuario (si los hay)
            const [programs] = await this.conex.query(`
                SELECT p.id, p.name, p.description, p.status
                FROM programs p
                INNER JOIN user_programs up ON p.id = up.program_id
                WHERE up.user_id = ? AND p.status = 'Active'
                ORDER BY p.name ASC
            `, [user.insertId]);

            return {
                user_id: user.insertId,
                name: name,
                email: normalizedEmail,
                role: role,
                programs: programs || [],
                config: {
                    config_id: config.insertId,
                    effects_sounds: true,
                    notify: true,
                    dark_mode: false,
                }
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
                    lockedUntil = new Date(Date.now() + 1 * 60 * 1000); // 1 minuto
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

            const [config] = await this.conex.query(
                'SELECT * FROM config WHERE user_id = ?',
                [user.user_id]
            );

            // Obtener programas asignados al usuario
            const [programs] = await this.conex.query(`
                SELECT p.id, p.name, p.description, p.status
                FROM programs p
                INNER JOIN user_programs up ON p.id = up.program_id
                WHERE up.user_id = ? AND p.status = 'Active'
                ORDER BY p.name ASC
            `, [user.user_id]);

            return {
                user_id: user.user_id,
                name: user.name,
                email: user.email,
                role: user.role,
                programs: programs || [],
                config: {
                    config_id: config[0].config_id,
                    effects_sounds: config[0].effects_sounds,
                    notify: config[0].notify,
                    dark_mode: config[0].dark_mode,
                }
            }
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error interno del servidor', cause: error };
        }
    };

    updatePreferences = async (preferenceData) => {
        try {
            const { userId, soundEffects, notify, darkMode } = preferenceData;
            
            // Primero obtenemos las preferencias actuales
            const [currentPrefs] = await this.conex.query(
                'SELECT effects_sounds, notify, dark_mode FROM config WHERE user_id = ?',
                [userId]
            );
            
            // Usamos los valores actuales si no se proporcionan nuevos
            const currentPref = currentPrefs[0];
            const newSoundEffects = soundEffects !== undefined ? soundEffects : currentPref.effects_sounds;
            const newNotify = notify !== undefined ? notify : currentPref.notify;
            const newDarkMode = darkMode !== undefined ? darkMode : currentPref.dark_mode;
            
            // Actualizamos solo con los valores que corresponden
            const [result] = await this.conex.query(
                'UPDATE config SET effects_sounds = ?, notify = ?, dark_mode = ? WHERE user_id = ?',
                [newSoundEffects, newNotify, newDarkMode, userId]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Preferencias no encontradas' };
            } 

            return {
                user_id: userId,
                effects_sounds: newSoundEffects,
                notify: newNotify,
                dark_mode: newDarkMode
            };
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error interno del servidor', cause: error };
        }
    };


    changePassword = async (changePasswordData) => {
        try {
            const { userId, currentPassword, newPassword } = changePasswordData;

            // Verificar si la contraseña actual es correcta
            const [users] = await this.conex.query(
                'SELECT * FROM users WHERE user_id = ?',
                [userId]
            );

            if (users.length === 0) {
                throw { status: 404, message: 'Usuario no encontrado' };
            }

            const user = users[0];
            const isPasswordValid = await this.comparePassword(currentPassword, user.password);
            if (!isPasswordValid) {
                throw { status: 401, message: 'Contraseña actual incorrecta' };
            }

            // Actualizar la contraseña
            const hashedPassword = await this.hashPassword(newPassword);
            await this.conex.query(
                'UPDATE users SET password = ? WHERE user_id = ?',
                [hashedPassword, userId]
            );

            return {
                user_id: userId,
                message: 'Contraseña actualizada correctamente',
            }
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error interno del servidor', cause: error };
        }
    }
}
export default AuthService;
