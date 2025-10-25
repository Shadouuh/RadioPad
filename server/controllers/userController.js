/**
 * Controlador para gestionar usuarios
 */

/**
 * Obtener todos los usuarios
 */
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await req.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    res.json(users);
  } catch (error) {
    next(error);
  }
};

/**
 * Obtener un usuario por ID
 */
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const user = await req.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        programs: {
          select: {
            program: {
              select: {
                id: true,
                name: true,
                description: true,
                status: true
              }
            }
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Transformar la estructura de programas para una respuesta más limpia
    const formattedUser = {
      ...user,
      programs: user.programs.map(up => up.program)
    };
    
    res.json(formattedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Crear un nuevo usuario
 */
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validar datos
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nombre, email y contraseña son requeridos' });
    }
    
    // Verificar si el usuario ya existe
    const existingUser = await req.prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }
    
    // Crear usuario
    const user = await req.prisma.user.create({
      data: {
        name,
        email,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * Actualizar un usuario existente
 */
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    
    // Verificar si el usuario existe
    const existingUser = await req.prisma.user.findUnique({
      where: { id }
    });
    
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Verificar si el email ya está en uso por otro usuario
    if (email && email !== existingUser.email) {
      const emailInUse = await req.prisma.user.findUnique({
        where: { email }
      });
      
      if (emailInUse) {
        return res.status(400).json({ message: 'El email ya está en uso por otro usuario' });
      }
    }
    
    // Actualizar usuario
    const updatedUser = await req.prisma.user.update({
      where: { id },
      data: {
        name: name !== undefined ? name : existingUser.name,
        email: email !== undefined ? email : existingUser.email,
        role: role !== undefined ? role : existingUser.role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

/**
 * Eliminar un usuario
 */
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Verificar si el usuario existe
    const existingUser = await req.prisma.user.findUnique({
      where: { id }
    });
    
    if (!existingUser) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    // Eliminar relaciones con programas
    await req.prisma.userProgram.deleteMany({
      where: { userId: id }
    });
    
    // Eliminar usuario
    await req.prisma.user.delete({
      where: { id }
    });
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};