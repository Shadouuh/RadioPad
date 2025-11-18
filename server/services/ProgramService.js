class ProgramService {
    constructor(conex) {
        this.conex = conex;
    }

    // Crear un nuevo programa
    createProgram = async (programData) => {
        try {
            const { name, description, status = 'Active' } = programData;

            const [result] = await this.conex.query(
                'INSERT INTO programs (name, description, status, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
                [name, description, status]
            );

            return {
                id: result.insertId,
                name,
                description,
                status,
                effects: 0
            };

        } catch (error) {
            if (error.status) throw error;
            if (error.code === 'ER_DUP_ENTRY') {
                throw { status: 409, message: 'Ya existe un programa con ese nombre' };
            }
            throw { status: 500, message: 'Error interno del servidor', cause: error };
        }
    };

    // Obtener todos los programas
    getAllPrograms = async () => {
        try {
            const DEBUG_PROGRAMS = process.env.DEBUG_PROGRAMS === 'true';
            if (DEBUG_PROGRAMS) console.log('=== DEBUG getAllPrograms SQL ===');
            const [programs] = await this.conex.query(`
                SELECT 
                    p.id,
                    p.name,
                    p.description,
                    p.status,
                    p.created_at,
                    p.updated_at,
                    COUNT(s.id) as effects
                FROM programs p
                LEFT JOIN sounds s ON p.id = s.program_id
                GROUP BY p.id, p.name, p.description, p.status, p.created_at, p.updated_at
                ORDER BY p.created_at DESC
            `);
            
            if (DEBUG_PROGRAMS) {
                console.log('Programas encontrados:', programs.length);
                console.log('Primeros programas:', programs.slice(0, 3));
            }

            return programs;

        } catch (error) {
            console.error('Error en getAllPrograms:', error);
            throw { status: 500, message: 'Error al obtener los programas', cause: error };
        }
    };

    // Obtener programas por IDs
    getProgramsByIds = async (programIds) => {
        try {
            const DEBUG_PROGRAMS = process.env.DEBUG_PROGRAMS === 'true';
            if (DEBUG_PROGRAMS) {
                console.log('=== DEBUG getProgramsByIds ===');
                console.log('programIds recibidos:', programIds);
            }
            
            if (!programIds || programIds.length === 0) {
                if (DEBUG_PROGRAMS) console.log('No hay programIds, devolviendo array vacío');
                return [];
            }

            const placeholders = programIds.map(() => '?').join(',');
            if (DEBUG_PROGRAMS) console.log('Placeholders:', placeholders);
            
            const [programs] = await this.conex.query(`
                SELECT 
                    p.id,
                    p.name,
                    p.description,
                    p.status,
                    p.created_at,
                    p.updated_at,
                    COUNT(s.id) as effects
                FROM programs p
                LEFT JOIN sounds s ON p.id = s.program_id
                WHERE p.id IN (${placeholders})
                GROUP BY p.id, p.name, p.description, p.status, p.created_at, p.updated_at
                ORDER BY p.created_at DESC
            `, programIds);
            
            if (DEBUG_PROGRAMS) {
                console.log('Programas encontrados por IDs:', programs.length);
                console.log('Programas:', programs);
            }

            return programs;

        } catch (error) {
            console.error('Error en getProgramsByIds:', error);
            throw { status: 500, message: 'Error al obtener los programas por IDs', cause: error };
        }
    };

    // Obtener programas de un usuario específico
    getUserPrograms = async (userId) => {
        try {
            const DEBUG_PROGRAMS = process.env.DEBUG_PROGRAMS === 'true';
            if (DEBUG_PROGRAMS) {
                console.log('=== DEBUG getUserPrograms ===');
                console.log('userId recibido:', userId);
            }
            
            const [programs] = await this.conex.query(`
                SELECT 
                    p.id,
                    p.name,
                    p.description,
                    p.status,
                    p.created_at,
                    p.updated_at,
                    COUNT(s.id) as effects,
                    up.assigned_at
                FROM programs p
                INNER JOIN user_programs up ON p.id = up.program_id
                LEFT JOIN sounds s ON p.id = s.program_id
                WHERE up.user_id = ?
                GROUP BY p.id, p.name, p.description, p.status, p.created_at, p.updated_at, up.assigned_at
                ORDER BY p.created_at DESC
            `, [userId]);
            
            if (DEBUG_PROGRAMS) {
                console.log('Programas del usuario encontrados:', programs.length);
                console.log('Programas:', programs);
            }

            return programs;

        } catch (error) {
            console.error('Error en getUserPrograms:', error);
            throw { status: 500, message: 'Error al obtener los programas del usuario', cause: error };
        }
    };

    // Obtener un programa por ID con sus sonidos
    getProgramById = async (programId) => {
        try {
            const [programs] = await this.conex.query(`
                SELECT 
                    p.id,
                    p.name,
                    p.description,
                    p.status,
                    p.created_at,
                    p.updated_at,
                    COUNT(s.id) as effects
                FROM programs p
                LEFT JOIN sounds s ON p.id = s.program_id
                WHERE p.id = ?
                GROUP BY p.id, p.name, p.description, p.status, p.created_at, p.updated_at
            `, [programId]);

            if (programs.length === 0) {
                throw { status: 404, message: 'Programa no encontrado' };
            }

            const program = programs[0];

            // Obtener los sonidos del programa
            const [sounds] = await this.conex.query(`
                SELECT 
                    id,
                    name,
                    duration,
                    category,
                    description,
                    file_url,
                    created_at
                FROM sounds
                WHERE program_id = ?
                ORDER BY created_at ASC
            `, [programId]);

            program.sounds = sounds;

            return program;

        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al obtener el programa', cause: error };
        }
    };

    // Actualizar un programa
    updateProgram = async (programId, programData) => {
        try {
            const { name, description, status } = programData;

            const [result] = await this.conex.query(
                'UPDATE programs SET name = ?, description = ?, status = ?, updated_at = NOW() WHERE id = ?',
                [name, description, status, programId]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Programa no encontrado' };
            }

            return await this.getProgramById(programId);

        } catch (error) {
            if (error.status) throw error;
            if (error.code === 'ER_DUP_ENTRY') {
                throw { status: 409, message: 'Ya existe un programa con ese nombre' };
            }
            throw { status: 500, message: 'Error al actualizar el programa', cause: error };
        }
    };

    // Eliminar un programa
    deleteProgram = async (programId) => {
        try {
            // Primero eliminar todos los sonidos asociados al programa
            await this.conex.query('DELETE FROM sounds WHERE program_id = ?', [programId]);

            // Luego eliminar el programa
            const [result] = await this.conex.query('DELETE FROM programs WHERE id = ?', [programId]);

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Programa no encontrado' };
            }

            return { message: 'Programa eliminado exitosamente' };

        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al eliminar el programa', cause: error };
        }
    };

    // Cambiar el estado de un programa
    toggleProgramStatus = async (programId) => {
        try {
            // Primero obtener el estado actual
            const [current] = await this.conex.query(
                'SELECT status FROM programs WHERE id = ?',
                [programId]
            );

            if (current.length === 0) {
                throw { status: 404, message: 'Programa no encontrado' };
            }

            const newStatus = current[0].status === 'Active' ? 'Inactive' : 'Active';

            const [result] = await this.conex.query(
                'UPDATE programs SET status = ?, updated_at = NOW() WHERE id = ?',
                [newStatus, programId]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Programa no encontrado' };
            }

            return await this.getProgramById(programId);

        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al cambiar el estado del programa', cause: error };
        }
    };

    // Asignar un programa a un usuario
    assignProgramToUser = async (userId, programId, assignedBy) => {
        try {
            // Verificar que el usuario existe
            const [users] = await this.conex.query(
                'SELECT user_id FROM users WHERE user_id = ?',
                [userId]
            );

            if (users.length === 0) {
                throw { status: 404, message: 'Usuario no encontrado' };
            }

            // Verificar que el programa existe
            const [programs] = await this.conex.query(
                'SELECT id FROM programs WHERE id = ?',
                [programId]
            );

            if (programs.length === 0) {
                throw { status: 404, message: 'Programa no encontrado' };
            }

            // Verificar que no esté ya asignado
            const [existing] = await this.conex.query(
                'SELECT user_program_id FROM user_programs WHERE user_id = ? AND program_id = ?',
                [userId, programId]
            );

            if (existing.length > 0) {
                throw { status: 409, message: 'El programa ya está asignado a este usuario' };
            }

            const [result] = await this.conex.query(
                'INSERT INTO user_programs (user_id, program_id, assigned_by, assigned_at) VALUES (?, ?, ?, NOW())',
                [userId, programId, assignedBy]
            );

            return {
                user_program_id: result.insertId,
                user_id: userId,
                program_id: programId,
                assigned_by: assignedBy,
                assigned_at: new Date()
            };

        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al asignar el programa al usuario', cause: error };
        }
    };

    // Desasignar un programa de un usuario
    unassignProgramFromUser = async (userId, programId) => {
        try {
            const [result] = await this.conex.query(
                'DELETE FROM user_programs WHERE user_id = ? AND program_id = ?',
                [userId, programId]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Asignación no encontrada' };
            }

            return { message: 'Programa desasignado del usuario exitosamente' };

        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al desasignar el programa del usuario', cause: error };
        }
    };

    // Obtener usuarios asignados a un programa
    getProgramUsers = async (programId) => {
        try {
            const [users] = await this.conex.query(`
                SELECT 
                    u.user_id,
                    u.name,
                    u.email,
                    u.role,
                    u.active,
                    up.assigned_at,
                    up.assigned_by,
                    asignador.name as assigned_by_name
                FROM user_programs up
                INNER JOIN users u ON up.user_id = u.user_id
                LEFT JOIN users asignador ON up.assigned_by = asignador.user_id
                WHERE up.program_id = ?
                ORDER BY up.assigned_at DESC
            `, [programId]);

            return users;

        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al obtener los usuarios del programa', cause: error };
        }
    };
}

export default ProgramService;