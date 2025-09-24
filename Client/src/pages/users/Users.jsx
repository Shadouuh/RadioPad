import React, { useState } from 'react';
import { FiUser, FiEdit, FiTrash2, FiPlus } from 'react-icons/fi';
import UserModal from './modals/UserModal';
import './styles/users.css';
import { useSidebar } from '../../shared/contexts/SidebarContext';

const Users = () => {
  const { isCollapsed } = useSidebar();

  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Jefe de Operaciones',
      email: 'admin@radiopad.com',
      role: 'Jefe de Operaciones'
    },
    {
      id: 2,
      name: 'Operador Principal',
      email: 'operator@radiopad.com',
      role: 'Operador'
    },
    {
      id: 3,
      name: 'Usuario Demo',
      email: 'user@radiopad.com',
      role: 'Usuario'
    },
    {
      id: 4,
      name: 'Operador Nocturno',
      email: 'night@radiopad.com',
      role: 'Operador'
    }
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
  };

  const handleSaveUser = (userData) => {
    if (selectedUser) {
      // Editar usuario existente
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...userData }
          : user
      ));
    } else {
      // Crear nuevo usuario
      const newUser = {
        id: Math.max(...users.map(u => u.id)) + 1,
        ...userData
      };
      setUsers([...users, newUser]);
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
        <div className="users-section">
          <div className="section-header">
            <h2>Usuarios del Sistema</h2>
            <p>Lista de todos los usuarios registrados</p>
          </div>

          <div className="users-list">
            {users.map(user => (
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
                      onClick={() => handleEditUser(user)}
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
            ))}
          </div>
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