import React, { useState, useEffect, useContext } from 'react';
import { FiUser, FiEdit, FiTrash2, FiPlus, FiPower } from 'react-icons/fi';
import UserModal from './modals/UserModal'; 
import './styles/users.css';
import { useSidebar } from '../../shared/contexts/SidebarContext';
import { UserContext } from '../../shared/contexts/UserContext';
import UserService from '../../shared/services/UserService';
import ProgramService from '../../shared/services/ProgramService';
import useNotification from '../../shared/hooks/useNotification';
import usePermisos from '../../shared/hooks/usePermisos';

const Users = () => {
  const { isCollapsed } = useSidebar();
  const { user, loading: userLoading } = useContext(UserContext);
  const notify = useNotification();

  const [users, setUsers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { hasFullAccess } = usePermisos();
  
  // Cargar usuarios y programas al montar el componente
  useEffect(() => {
    if (hasFullAccess()) {
      loadUsers();
      loadPrograms();
    }
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
    if (!hasFullAccess()) {
      notify('No tienes permisos para crear usuarios', 'error');
      return;
    }
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    if (!hasFullAccess()) {
      notify('No tienes permisos para editar este usuario', 'error');
      return;
    }
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const toggleUser = async (userId, isActive) => {
    if (!hasFullAccess()) {
      notify('No tienes permisos para cambiar el estado de usuarios', 'error');
      return;
    }
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
      // Verificar permisos antes de guardar
      if (selectedUser) {
        // Editar usuario existente
        if (!hasFullAccess()) {
          notify('No tienes permisos para editar este usuario', 'error');
          return;
        }
      } else {
        // Crear nuevo usuario
        if (!hasFullAccess()) {
          notify('No tienes permisos para crear usuarios', 'error');
          return;
        }
      }
      
      let response;
      if (selectedUser) {
        response = await UserService.updateUser(selectedUser.id, userData);
        if (response.success) {
          notify('Usuario actualizado correctamente', 'success');
        }
      } else {
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

  const getUserPrograms = (user) => {
    if (!user.programs || user.programs.length === 0) {
      return ['Sin programas asignados'];
    }
    return user.programs.map(program => program.name);
  };

  // Mostrar estado de carga mientras se obtiene el usuario
  if (userLoading || !user) {
    return (
      <div className={`users-container ${isCollapsed ? ' with-sidebar-collapsed' : ''}`}>
        <div className="users-header">
          <div className="header-content">
            <h1>Gestión de Usuarios</h1>
            <p>Cargando información del usuario...</p>
          </div>
        </div>
        <div className="users-content">
          <div className="loading-message">
            <p>Verificando permisos...</p>
          </div>
        </div>
      </div>
    );
  }

  // Verificar que el usuario tenga un rol válido para acceder a esta sección
  const validRoles = ['Jefe de Operadores', 'Operador'];
  if (!validRoles.includes(user.role)) {
    return (
      <div className={`users-container ${isCollapsed ? ' with-sidebar-collapsed' : ''}`}>
        <div className="users-header">
          <div className="header-content">
            <h1>Gestión de Usuarios</h1>
            <p>Acceso no autorizado</p>
          </div>
        </div>
        <div className="users-content">
          <div className="no-users-access">
            <div className="no-access-icon">🚫</div>
            <h3>Acceso Denegado</h3>
            <p>No tienes los permisos necesarios para acceder a esta sección</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`users-container ${isCollapsed ? ' with-sidebar-collapsed' : ''}`}>
      <div className="users-header">
        <div className="header-content">
          <h1>Gestión de Usuarios</h1>
          <p>Administra los usuarios del sistema</p>
        </div>
        {hasFullAccess() && (
          <button className="new-user-btn" onClick={handleCreateUser}>
            <FiPlus />
            Nuevo Usuario
          </button>
        )}
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
                      <div className="user-program-badges">
                        {getUserPrograms(user).map((programName, index) => (
                          <span key={index} className="program-badge">{programName}</span>
                        ))}
                      </div>
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
                      {hasFullAccess() && (
                        <button 
                          className="edit-btn"
                          onClick={() => handleEditUser(user)}
                          title="Editar usuario"
                        >
                          <FiEdit />
                        </button>
                      )}
                      {hasFullAccess() && (
                        <button 
                          className="delete-btn"
                          onClick={() => toggleUser(user.id, user.active)}
                          title={user.active ? 'Desactivar usuario' : 'Activar usuario'}
                        >
                          <FiPower />
                        </button>
                      )}
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
        currentUser={user}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default Users;