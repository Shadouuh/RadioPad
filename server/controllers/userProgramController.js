/**
 * Controlador para gestionar la relación entre usuarios y programas
 */

/**
 * Asignar un programa a un usuario
 */
export const assignProgramToUser = async (req, res, next) => {
  try {
    const { userId, programId } = req.body;
    
    // Validar datos requeridos
    if (!userId || !programId) {
      return res.status(400).json({ message: 'ID de usuario y programa son requeridos' });
    }
    
    // Verificar si el usuario existe
    const user = await req.prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Verificar si el programa existe
    const program = await req.prisma.program.findUnique({
      where: { id: programId }
    });
    
    if (!program) {
      return res.status(404).json({ message: 'Programa no encontrado' });
    }
    
    // Verificar si la relación ya existe
    const existingRelation = await req.prisma.userProgram.findUnique({
      where: {
        userId_programId: {
          userId,
          programId
        }
      }
    });
    
    if (existingRelation) {
      return res.status(400).json({ message: 'El usuario ya está asignado a este programa' });
    }
    
    // Crear la relación
    const userProgram = await req.prisma.userProgram.create({
      data: {
        userId,
        programId
      }
    });
    
    res.status(201).json(userProgram);
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar la asignación de un programa a un usuario
 */
export const removeProgramFromUser = async (req, res, next) => {
  try {
    const { userId, programId } = req.params;
    
    // Verificar si la relación existe
    const existingRelation = await req.prisma.userProgram.findUnique({
      where: {
        userId_programId: {
          userId,
          programId
        }
      }
    });
    
    if (!existingRelation) {
      return res.status(404).json({ message: 'Relación no encontrada' });
    }
    
    // Eliminar la relación
    await req.prisma.userProgram.delete({
      where: {
        userId_programId: {
          userId,
          programId
        }
      }
    });
    
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener todos los programas de un usuario
 */
export const getUserPrograms = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    // Verificar si el usuario existe
    const user = await req.prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Obtener los programas del usuario
    const userPrograms = await req.prisma.program.findMany({
      where: {
        users: {
          some: {
            userId
          }
        }
      }
    });
    
    res.json(userPrograms);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener todos los usuarios de un programa
 */
export const getProgramUsers = async (req, res, next) => {
  try {
    const { programId } = req.params;
    
    // Verificar si el programa existe
    const program = await req.prisma.program.findUnique({
      where: { id: programId }
    });
    
    if (!program) {
      return res.status(404).json({ message: 'Programa no encontrado' });
    }
    
    // Obtener los usuarios del programa
    const programUsers = await req.prisma.user.findMany({
      where: {
        programs: {
          some: {
            programId
          }
        }
      }
    });
    
    res.json(programUsers);
  } catch (error) {
    next(error);
  }
};