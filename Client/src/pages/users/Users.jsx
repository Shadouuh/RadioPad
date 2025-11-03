import React, { useState, useEffect } from 'react';
import { FiUser, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import UserModal from './modals/UserModal';
import './styles/users.css';
import { useSidebar } from '../../shared/contexts/SidebarContext';
import UserService from '../../shared/services/UserService';
import ProgramService from '../../shared/services/ProgramService';
import useNotification from '../../shared/hooks/useNotification';

const Users = () => {
  const { isCollapsed } = useSidebar();
  const notify = useNotification();

  const [users, setUsers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Cargar usuarios y programas al montar el componente
  useEffect(() => {
    loadUsers();
    loadPrograms();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getAllUsers();
      if (response.success) {
        setUsers(response.data);
      } else {
        notify('Error al cargar usuarios', 'error');
      }
    } catch (error) {
      console.error('Error loading users:', error);
      notify(error?.response?.data?.message || 'Error al cargar usuarios', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadPrograms = async () => {
    try {
      const response = await ProgramService.getAllPrograms();
      if (response.success) {
        setPrograms(response.data);
      } else {
        notify('Error al cargar programas', 'error');
      }
    } catch (error) {
      console.error('Error loading programs:', error);
      notify(error?.response?.data?.message || 'Error al cargar programas', 'error');
    }
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const toggleUser = async (userId, isActive) => {
    if (window.confirm(isActive ? '¿Estás seguro de que deseas activar este usuario?' : '¿Estás seguro de que deseas desactivar este usuario?')) {
      try {
        const response = await UserService.toggleUser(userId);
        if (response.success) {
          notify(isActive ? 'Usuario activado correctamente' : 'Usuario desactivado correctamente', 'success');
          loadUsers(); // Recargar la lista
        } else {
          notify(isActive ? 'Error al activar usuario' : 'Error al desactivar usuario', 'error');
        }
      } catch (error) {
        console.error('Error desactivating user:', error);
        notify(error?.response?.data?.message || isActive ? 'Error al activar usuario' : 'Error al desactivar usuario', 'error');
      }
    }
  };

  const handleSaveUser = async (userData) => {
    try {
      let response;
      if (selectedUser) {
        // Editar usuario existente
        response = await UserService.updateUser(selectedUser.id, userData);
        if (response.success) {
          notify('Usuario actualizado correctamente', 'success');
        }
      } else {
        // Crear nuevo usuario
        response = await UserService.createUser(userData);
        if (response.success) {
          notify('Usuario creado correctamente', 'success');
        }
      }
      
      if (response.success) {
        loadUsers(); // Recargar la lista
        setIsModalOpen(false);
      } else {
        notify('Error al guardar usuario', 'error');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      notify(error?.response?.data?.message || 'Error al guardar usuario', 'error');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'Jefe de Operadores':
        return 'role-admin';
      case 'Operador':
        return 'role-operator';
      case 'Usuario':
        return 'role-user';
      default:
        return 'role-user';
    }
  };

  const getProgramName = (programId) => {
    if (!programId) return 'Sin programa asignado';
    const program = programs.find(p => p.id === programId);
    return program ? program.name : 'Programa no encontrado';
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
        <div className="users-section">
          <div className="section-header">
            <h2>Usuarios del Sistema</h2>
            <p>Lista de todos los usuarios registrados</p>
          </div>

          <div className="users-list">
            {loading ? (
              <div className="loading-message">
                <p>Cargando usuarios...</p>
              </div>
            ) : users && users.length === 0 ? (
              <div className="empty-message">
                <p>No hay usuarios registrados</p>
              </div>
            ) : (
              users && users.map(user => (
                <div key={user.id} className="user-card">
                  <div className="user-info">
                    <div className="user-avatar">
                      <FiUser />
                    </div>
                    <div className="user-details">
                      <h3>{user.name}</h3>
                      <p className="user-email">{user.email}</p>
                      <p className="user-program">{getProgramName(user.program_id)}</p>
                    </div>
                  </div>
                  
                  <div className="user-actions">
                    <span className={`user-role ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                    <span className={`user-role ${getRoleColor(user.role)}`}>
                      {user.active ? 'Activo' : 'Inactivo'}
                    </span>
                    <div className="action-buttons">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEditUser(user)}
                        title="Editar usuario"
                      >
                        <FiEdit />
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => toggleUser(user.id, user.active)}
                        title={user.active ? 'Desactivar usuario' : 'Activar usuario'}
                      >
                        🥟
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <UserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        user={selectedUser}
        programs={programs}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default Users;