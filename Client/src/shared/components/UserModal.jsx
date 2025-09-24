import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiUser, FiChevronDown } from 'react-icons/fi';
import './UserModal.css';

const UserModal = ({ isOpen, onClose, position }) => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState('Jefe de Operaciones');
  const [showUserOptions, setShowUserOptions] = useState(false);

  const userRoles = [
    { name: 'Jefe de Operaciones', role: 'Administrador' },
    { name: 'Operador', role: 'Operador' },
    { name: 'Usuario Común y Corriente', role: 'Usuario' }
  ];

  const handleLogout = () => {
    onClose();
    navigate('/login');
  };

  const handleUserSwitch = (userName) => {
    setCurrentUser(userName);
    setShowUserOptions(false);
  };

  const getCurrentUserRole = () => {
    const user = userRoles.find(u => u.name === currentUser);
    return user ? user.role : 'Usuario';
  };

  const getUserInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="user-modal-overlay" onClick={onClose} />
      <div 
        className="user-modal" 
        style={{ 
          bottom: position?.bottom || '20px',
          left: position?.left || '20px'
        }}
      >
        <div className="user-modal-header">
          <div className="user-modal-avatar">
            <span>{getUserInitials(currentUser)}</span>
          </div>
          <div className="user-modal-info">
            <h3>{currentUser}</h3>
            <p>{getCurrentUserRole()}</p>
          </div>
        </div>

        <div className="user-modal-content">
          {/* Cambiar Usuario */}
          <div className="user-modal-section">
            <button 
              className="user-modal-option"
              onClick={() => setShowUserOptions(!showUserOptions)}
            >
              <FiUser className="option-icon" />
              <span>Cambiar Usuario</span>
              <FiChevronDown className={`chevron ${showUserOptions ? 'rotated' : ''}`} />
            </button>
            
            {showUserOptions && (
              <div className="user-options-dropdown">
                {userRoles.map((userRole, index) => (
                  <button
                    key={index}
                    className={`user-option ${currentUser === userRole.name ? 'active' : ''}`}
                    onClick={() => handleUserSwitch(userRole.name)}
                  >
                    <div className="user-option-avatar">
                      <span>{getUserInitials(userRole.name)}</span>
                    </div>
                    <div className="user-option-info">
                      <span className="user-option-name">{userRole.name}</span>
                      <span className="user-option-role">{userRole.role}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Logout */}
          <div className="user-modal-section">
            <button className="user-modal-option logout" onClick={handleLogout}>
              <FiLogOut className="option-icon" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserModal;