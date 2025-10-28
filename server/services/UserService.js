import AuthService from "./AuthService.js";

class UserService {
    constructor(conex) {
        this.conex = conex;
        this.AuthService = new AuthService(conex);
    }

    // Obtener todos los usuarios
    getAllUsers = async () => {
        try {
            const [users] = await this.conex.query(
                'SELECT user_id as id, name, email, role, active, created_at FROM users ORDER BY created_at DESC'
            );
            return users;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener usuarios', cause: error };
        }
    };

    // Obtener usuario por ID
    getUserById = async (userId) => {
        try {
            const [users] = await this.conex.query(
                'SELECT user_id as id, name, email, role, active, created_at FROM users WHERE user_id = ?',
                [userId]
            );

            if (users.length === 0) {
                throw { status: 404, message: 'Usuario no encontrado' };
            }

            return users[0];
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al obtener usuario', cause: error };
        }
    };

    // Crear nuevo usuario
    createUser = async (userData) => {
        try {
            const { name, email, role = 'Productor' } = userData;

            if (!name || !email) {
                throw { status: 400, message: 'Nombre y email son requeridos' };
            }

            // Validar que el rol sea válido
            const validRoles = ['Productor', 'Operador', 'Jefe de Operadores'];
            if (!validRoles.includes(role)) {
                throw { status: 400, message: 'Rol inválido' };
            }

            const normalizedEmail = email.toLowerCase().trim();

            const result = await this.AuthService.registerUser({ name, email: normalizedEmail, password: '1234', role });
            
            return {
                id: result.insertId,
                name,
                email: normalizedEmail,
                role,
            };
        } catch (error) {
            if (error.status) throw error;
            if (error.code === 'ER_DUP_ENTRY') {
                throw { status: 409, message: 'El email ya está registrado' };
            }
            throw { status: 500, message: 'Error al crear usuario', cause: error };
        }
    };

    // Actualizar usuario
    updateUser = async (userId, userData) => {
        try {
            const { name, email, role } = userData;

            if (!name || !email) {
                throw { status: 400, message: 'Nombre y email son requeridos' };
            }

            // Validar que el rol sea válido
            const validRoles = ['Productor', 'Operador', 'Jefe de Operadores'];
            if (role && !validRoles.includes(role)) {
                throw { status: 400, message: 'Rol inválido' };
            }

            const normalizedEmail = email.toLowerCase().trim();

            const [result] = await this.conex.query(
                'UPDATE users SET name = ?, email = ?, role = ? WHERE user_id = ?',
                [name, normalizedEmail, role, userId]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Usuario no encontrado' };
            }

            return {
                id: userId,
                name,
                email: normalizedEmail,
                role
            };
        } catch (error) {
            if (error.status) throw error;
            if (error.code === 'ER_DUP_ENTRY') {
                throw { status: 409, message: 'El email ya está registrado' };
            }
            throw { status: 500, message: 'Error al actualizar usuario', cause: error };
        }
    };

    // Eliminar usuario (soft delete)
    deleteUser = async (userId) => {
        try {
            const [result] = await this.conex.query(
                'UPDATE users SET active = 0 WHERE user_id = ?',
                [userId]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Usuario no encontrado' };
            }

            return { message: 'Usuario desactivado correctamente' };
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al eliminar usuario', cause: error };
        }
    };

    // Activar/Desactivar usuario
    toggleUserStatus = async (userId) => {
        try {
            // Primero obtener el estado actual
            const [users] = await this.conex.query(
                'SELECT active FROM users WHERE user_id = ?',
                [userId]
            );

            if (users.length === 0) {
                throw { status: 404, message: 'Usuario no encontrado' };
            }

            const newStatus = users[0].active ? 0 : 1;

            const [result] = await this.conex.query(
                'UPDATE users SET active = ? WHERE user_id = ?',
                [newStatus, userId]
            );

            return { 
                message: `Usuario ${newStatus ? 'activado' : 'desactivado'} correctamente`,
                active: newStatus
            };
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al cambiar estado del usuario', cause: error };
        }
    };

    // Obtener usuarios por rol
    getUsersByRole = async (role) => {
        try {
            const validRoles = ['Productor', 'Operador', 'Jefe de Operadores'];
            if (!validRoles.includes(role)) {
                throw { status: 400, message: 'Rol inválido' };
            }

            const [users] = await this.conex.query(
                'SELECT user_id as id, name, email, role, active, created_at FROM users WHERE role = ? AND active = 1 ORDER BY created_at DESC',
                [role]
            );

            return users;
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al obtener usuarios por rol', cause: error };
        }
    };
}

export default UserService;