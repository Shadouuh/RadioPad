import React, { useState, useEffect } from 'react';
import { FiUser, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import UserModal from './modals/UserModal';
import './styles/users.css';
import { useSidebar } from '../../shared/contexts/SidebarContext';
import { userService } from './services/userService';
import { userProgramService } from './services/userProgramService';

const Users = () => {
  const { isCollapsed } = useSidebar();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAll();
      setUsers(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar usuarios. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = async (userId) => {
    try {
      setLoading(true);
      // Obtener usuario con sus programas asignados
      const userData = await userService.getById(userId);
      setSelectedUser(userData);
      setIsModalOpen(true);
    } catch (err) {
      console.error(`Error al obtener usuario ${userId}:`, err);
      setError('Error al cargar datos del usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Está seguro que desea eliminar este usuario?')) {
      try {
        setLoading(true);
        await userService.delete(userId);
        await loadUsers(); // Recargar la lista después de eliminar
      } catch (err) {
        console.error(`Error al eliminar usuario ${userId}:`, err);
        setError('Error al eliminar usuario');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      setLoading(true);
      const { selectedPrograms, ...userDataToSave } = userData;
      
      if (selectedUser) {
        // Actualizar usuario existente
        await userService.update(selectedUser.id, userDataToSave);
        
        // Actualizar asignaciones de programas
        if (selectedPrograms && selectedPrograms.length > 0) {
          // Primero obtenemos los programas actuales
          const currentUserData = await userService.getById(selectedUser.id);
          const currentProgramIds = currentUserData.programs?.map(p => p.id) || [];
          
          // Programas a agregar (están en selectedPrograms pero no en currentProgramIds)
          const programsToAdd = selectedPrograms.filter(id => !currentProgramIds.includes(id));
          
          // Programas a eliminar (están en currentProgramIds pero no en selectedPrograms)
          const programsToRemove = currentProgramIds.filter(id => !selectedPrograms.includes(id));
          
          // Agregar nuevos programas
          for (const programId of programsToAdd) {
            await userProgramService.assignProgram(selectedUser.id, programId);
          }
          
          // Eliminar programas que ya no están seleccionados
          for (const programId of programsToRemove) {
            await userProgramService.removeProgram(selectedUser.id, programId);
          }
        }
      } else {
        // Crear nuevo usuario
        const newUser = await userService.create(userDataToSave);
        
        // Asignar programas al nuevo usuario
        if (selectedPrograms && selectedPrograms.length > 0) {
          for (const programId of selectedPrograms) {
            await userProgramService.assignProgram(newUser.id, programId);
          }
        }
      }
      
      // Recargar la lista de usuarios
      await loadUsers();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error al guardar usuario:', err);
      setError('Error al guardar usuario');
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Jefe de Operaciones':
        return 'role-admin';
      case 'Operador':
        return 'role-operator';
      case 'Usuario':
        return 'role-user';
      default:
        return 'role-user';
    }
  };

  return (
    <div className={`users-container ${isCollapsed ? ' with-sidebar-collapsed' : ''}`}>
      <div className="users-header">
        <div className="header-content">
          <h1>Gestión de Usuarios</h1>
          <p>Administra los usuarios del sistema</p>
        </div>
        <button className="new-user-btn" onClick={handleCreateUser}>
          <FiPlus />
          Nuevo Usuario
        </button>
      </div>

      <div className="users-content">
        {error && <div className="error-message">{error}</div>}
        
        <div className="users-section">
          <div className="section-header">
            <h2>Usuarios del Sistema</h2>
            <p>Lista de todos los usuarios registrados</p>
          </div>

          {loading ? (
            <div className="loading">Cargando usuarios...</div>
          ) : (
            <div className="users-list">
              {users.length > 0 ? (
                users.map(user => (
                  <div key={user.id} className="user-card">
                    <div className="user-info">
                      <div className="user-avatar">
                        <FiUser />
                      </div>
                      <div className="user-details">
                        <h3>{user.name}</h3>
                        <p className="user-email">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="user-actions">
                      <span className={`user-role ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                      <div className="action-buttons">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditUser(user.id)}
                          title="Editar usuario"
                        >
                          <FiEdit />
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDeleteUser(user.id)}
                          title="Eliminar usuario"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-users">No hay usuarios registrados</div>
              )}
            </div>
          )}
        </div>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default Users;