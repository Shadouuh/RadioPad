import AuthService from "./AuthService.js";

class UserService {
    constructor(conex) {
        this.conex = conex;
        this.AuthService = new AuthService(conex);
    }

    // Obtener todos los usuarios
    getAllUsers = async () => {
        try {
            // Primero obtener todos los usuarios
            const [users] = await this.conex.query(
                'SELECT user_id as id, name, email, role, active, created_at FROM users ORDER BY created_at DESC'
            );

            // Luego obtener los programas de cada usuario
            for (let user of users) {
                const [programs] = await this.conex.query(
                    `SELECT p.id, p.name, p.description 
                     FROM user_programs up 
                     INNER JOIN programs p ON up.program_id = p.id 
                     WHERE up.user_id = ?`,
                    [user.id]
                );
                user.programs = programs;
            }

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

            const user = users[0];

            // Obtener los programas del usuario
            const [programs] = await this.conex.query(
                `SELECT p.id, p.name, p.description 
                 FROM user_programs up 
                 INNER JOIN programs p ON up.program_id = p.id 
                 WHERE up.user_id = ?`,
                [userId]
            );
            user.programs = programs;

            return user;
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al obtener usuario', cause: error };
        }
    };

    // Crear nuevo usuario
    createUser = async (userData) => {
        try {
            const { name, email, role = 'Productor', program_ids } = userData;

            if (!name || !email) {
                throw { status: 400, message: 'Nombre y email son requeridos' };
            }

            // Validar que el rol sea válido
            const validRoles = ['Productor', 'Operador', 'Jefe de Operadores'];
            if (!validRoles.includes(role)) {
                throw { status: 400, message: 'Rol inválido' };
            }

            // Validar program_ids si se proporciona
            if (program_ids && program_ids.length > 0) {
                // Verificar que todos los programas existan
                const [existingPrograms] = await this.conex.query(
                    'SELECT id FROM programs WHERE id IN (?)',
                    [program_ids]
                );
                
                if (existingPrograms.length !== program_ids.length) {
                    throw { status: 400, message: 'Algunos programas no existen' };
                }
            }

            const normalizedEmail = email.toLowerCase().trim();

            // Crear el usuario sin program_id (ya no se usa)
            const result = await this.AuthService.registerUser({ 
                name, 
                email: normalizedEmail, 
                password: '1234', 
                role, 
                program_id: null // Ya no se usa program_id individual
            });

            // Asignar programas al usuario si se proporcionaron
            if (program_ids && program_ids.length > 0) {
                const assignedBy = 1; // Asumimos que el usuario con ID 1 está creando
                const assignments = program_ids.map(programId => 
                    [result.user_id, programId, assignedBy, new Date()]
                );

                await this.conex.query(
                    'INSERT INTO user_programs (user_id, program_id, assigned_by, assigned_at) VALUES ?',
                    [assignments]
                );
            }
            
            return {
                id: result.user_id,
                name,
                email: normalizedEmail,
                role,
                program_ids: program_ids || []
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
            const { name, email, role, program_ids } = userData;

            if (!name || !email) {
                throw { status: 400, message: 'Nombre y email son requeridos' };
            }

            // Validar que el rol sea válido
            const validRoles = ['Productor', 'Operador', 'Jefe de Operadores'];
            if (role && !validRoles.includes(role)) {
                throw { status: 400, message: 'Rol inválido' };
            }

            // Validar program_ids si se proporciona
            if (program_ids && program_ids.length > 0) {
                // Verificar que todos los programas existan
                const [existingPrograms] = await this.conex.query(
                    'SELECT id FROM programs WHERE id IN (?)',
                    [program_ids]
                );
                
                if (existingPrograms.length !== program_ids.length) {
                    throw { status: 400, message: 'Algunos programas no existen' };
                }
            }

            const normalizedEmail = email.toLowerCase().trim();

            // Actualizar datos básicos del usuario (sin program_id)
            const [result] = await this.conex.query(
                'UPDATE users SET name = ?, email = ?, role = ? WHERE user_id = ?',
                [name, normalizedEmail, role, userId]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Usuario no encontrado' };
            }

            // Actualizar asignaciones de programas si se proporcionaron
            if (program_ids && Array.isArray(program_ids)) {
                // Eliminar asignaciones existentes
                await this.conex.query(
                    'DELETE FROM user_programs WHERE user_id = ?',
                    [userId]
                );

                // Insertar nuevas asignaciones si hay programas seleccionados
                if (program_ids.length > 0) {
                    const assignedBy = 1; // Asumimos que el usuario con ID 1 está actualizando
                    const assignments = program_ids.map(programId => 
                        [userId, programId, assignedBy, new Date()]
                    );

                    await this.conex.query(
                        'INSERT INTO user_programs (user_id, program_id, assigned_by, assigned_at) VALUES ?',
                        [assignments]
                    );
                }
            }

            return {
                id: userId,
                name,
                email: normalizedEmail,
                role,
                program_ids: program_ids || []
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
                'SELECT user_id as id, name, email, role, active, program_id, created_at FROM users WHERE role = ? AND active = 1 ORDER BY created_at DESC',
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