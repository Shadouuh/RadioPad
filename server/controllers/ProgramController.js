import handleError from '../utils/handleError.js';

class ProgramController {
    constructor(programService) {
        this.programService = programService;
    }

    // Crear un nuevo programa
    createProgram = async (req, res) => {
        try {
            const { name, description, status } = req.body;

            if (!name || !description) {
                throw { status: 400, message: 'El nombre y la descripción son requeridos' };
            }

            const program = await this.programService.createProgram({
                name,
                description,
                status: status || 'Active'
            });

            res.status(201).json({
                success: true,
                message: 'Programa creado exitosamente',
                data: program
            });

        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener todos los programas
    getAllPrograms = async (req, res) => {
        try {
            const programs = await this.programService.getAllPrograms();

            res.status(200).json({
                success: true,
                message: 'Programas obtenidos exitosamente',
                data: programs
            });

        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener un programa por ID
    getProgramById = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de programa inválido' };
            }

            const program = await this.programService.getProgramById(parseInt(id));

            res.status(200).json({
                success: true,
                message: 'Programa obtenido exitosamente',
                data: program
            });

        } catch (err) {
            return handleError(res, err);
        }
    };

    // Actualizar un programa
    updateProgram = async (req, res) => {
        try {
            const { id } = req.params;
            const { name, description, status } = req.body;

            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de programa inválido' };
            }

            if (!name || !description) {
                throw { status: 400, message: 'El nombre y la descripción son requeridos' };
            }

            const program = await this.programService.updateProgram(parseInt(id), {
                name,
                description,
                status
            });

            res.status(200).json({
                success: true,
                message: 'Programa actualizado exitosamente',
                data: program
            });

        } catch (err) {
            return handleError(res, err);
        }
    };

    // Eliminar un programa
    deleteProgram = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de programa inválido' };
            }

            const result = await this.programService.deleteProgram(parseInt(id));

            res.status(200).json({
                success: true,
                message: result.message
            });

        } catch (err) {
            return handleError(res, err);
        }
    };

    // Cambiar el estado de un programa (Active/Inactive)
    toggleProgramStatus = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de programa inválido' };
            }

            const program = await this.programService.toggleProgramStatus(parseInt(id));

            res.status(200).json({
                success: true,
                message: 'Estado del programa actualizado exitosamente',
                data: program
            });

        } catch (err) {
            return handleError(res, err);
        }
    };
}

export default ProgramController;