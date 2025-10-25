/**
 * Controlador para gestionar programas
 */

/**
 * Obtener todos los programas
 */
export const getAllPrograms = async (req, res, next) => {
  try {
    const programs = await req.prisma.program.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    res.json(programs);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener un programa por ID
 */
export const getProgramById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const program = await req.prisma.program.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        users: {
          select: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                role: true
              }
            }
          }
        }
      }
    });
    
    if (!program) {
      return res.status(404).json({ message: 'Programa no encontrado' });
    }
    
    // Transformar la estructura de usuarios para una respuesta más limpia
    const formattedProgram = {
      ...program,
      users: program.users.map(up => up.user)
    };
    
    res.json(formattedProgram);
  } catch (error) {
    next(error);
  }
};

/**
 * Crear un nuevo programa
 */
export const createProgram = async (req, res, next) => {
  try {
    const { name, description, status } = req.body;
    
    // Validar datos requeridos
    if (!name) {
      return res.status(400).json({ message: 'El nombre del programa es requerido' });
    }
    
    const newProgram = await req.prisma.program.create({
      data: {
        name,
        description: description || null,
        status: status || undefined, // Si no se proporciona, se usará el valor por defecto
      }
    });
    
    res.status(201).json(newProgram);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar un programa existente
 */
export const updateProgram = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;
    
    // Verificar si el programa existe
    const existingProgram = await req.prisma.program.findUnique({
      where: { id }
    });
    
    if (!existingProgram) {
      return res.status(404).json({ message: 'Programa no encontrado' });
    }
    
    // Actualizar programa
    const updatedProgram = await req.prisma.program.update({
      where: { id },
      data: {
        name: name || undefined,
        description: description !== undefined ? description : undefined,
        status: status || undefined,
      }
    });
    
    res.json(updatedProgram);
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar un programa
 */
export const deleteProgram = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Verificar si el programa existe
    const existingProgram = await req.prisma.program.findUnique({
      where: { id }
    });
    
    if (!existingProgram) {
      return res.status(404).json({ message: 'Programa no encontrado' });
    }
    
    // Eliminar programa
    await req.prisma.program.delete({
      where: { id }
    });
    
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};