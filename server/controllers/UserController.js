import handleError from '../utils/handleError.js';

class UserController {
    constructor(userService) {
        this.userService = userService;
    }

    // Obtener todos los usuarios
    getAllUsers = async (req, res) => {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json({
                success: true,
                message: 'Usuarios obtenidos correctamente',
                data: users
            });
        } catch (error) {
            return handleError(res, error);
        }
    };

    // Obtener usuario por ID
    getUserById = async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de usuario inválido' };
            }

            const user = await this.userService.getUserById(parseInt(id));
            res.status(200).json({
                success: true,
                message: 'Usuario obtenido correctamente',
                data: user
            });
        } catch (error) {
            return handleError(res, error);
        }
    };

    // Crear nuevo usuario
    createUser = async (req, res) => {
        try {
            const { name, email, role, program_id } = req.body;

            if (!name || !email) {
                throw { status: 400, message: 'Nombre y email son requeridos' };
            }

            const user = await this.userService.createUser({ name, email, role, program_id });
            res.status(201).json({
                success: true,
                message: 'Usuario creado correctamente',
                data: user
            });
        } catch (error) {
            return handleError(res, error);
        }
    };

    // Actualizar usuario
    updateUser = async (req, res) => {
        try {
            const { id } = req.params;
            const { name, email, role, program_id } = req.body;

            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de usuario inválido' };
            }

            if (!name || !email) {
                throw { status: 400, message: 'Nombre y email son requeridos' };
            }

            const user = await this.userService.updateUser(parseInt(id), { name, email, role, program_id });
            res.status(200).json({
                success: true,
                message: 'Usuario actualizado correctamente',
                data: user
            });
        } catch (error) {
            return handleError(res, error);
        }
    };

    // Eliminar usuario
    deleteUser = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de usuario inválido' };
            }

            const result = await this.userService.deleteUser(parseInt(id));
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            return handleError(res, error);
        }
    };

    // Activar/Desactivar usuario
    toggleUserStatus = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de usuario inválido' };
            }

            const result = await this.userService.toggleUserStatus(parseInt(id));
            res.status(200).json({
                success: true,
                message: result.message,
                data: { active: result.active }
            });
        } catch (error) {
            return handleError(res, error);
        }
    };

    // Obtener usuarios por rol
    getUsersByRole = async (req, res) => {
        try {
            const { role } = req.params;

            if (!role) {
                throw { status: 400, message: 'Rol es requerido' };
            }

            const users = await this.userService.getUsersByRole(role);
            res.status(200).json({
                success: true,
                message: `Usuarios con rol ${role} obtenidos correctamente`,
                data: users
            });
        } catch (error) {
            return handleError(res, error);
        }
    };
}

export default UserController;