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
            console.log('=== DEBUG getAllPrograms SQL ===');
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
            
            console.log('Programas encontrados:', programs.length);
            console.log('Primeros programas:', programs.slice(0, 3));

            return programs;

        } catch (error) {
            console.error('Error en getAllPrograms:', error);
            throw { status: 500, message: 'Error al obtener los programas', cause: error };
        }
    };

    // Obtener programas por IDs
    getProgramsByIds = async (programIds) => {
        try {
            console.log('=== DEBUG getProgramsByIds ===');
            console.log('programIds recibidos:', programIds);
            
            if (!programIds || programIds.length === 0) {
                console.log('No hay programIds, devolviendo array vacío');
                return [];
            }

            const placeholders = programIds.map(() => '?').join(',');
            console.log('Placeholders:', placeholders);
            
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
            
            console.log('Programas encontrados por IDs:', programs.length);
            console.log('Programas:', programs);

            return programs;

        } catch (error) {
            console.error('Error en getProgramsByIds:', error);
            throw { status: 500, message: 'Error al obtener los programas por IDs', cause: error };
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
            const [programs] = await this.conex.query('SELECT status FROM programs WHERE id = ?', [programId]);

            if (programs.length === 0) {
                throw { status: 404, message: 'Programa no encontrado' };
            }

            const currentStatus = programs[0].status;
            const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';

            await this.conex.query(
                'UPDATE programs SET status = ?, updated_at = NOW() WHERE id = ?',
                [newStatus, programId]
            );

            return await this.getProgramById(programId);

        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al cambiar el estado del programa', cause: error };
        }
    };
}

export default ProgramService;