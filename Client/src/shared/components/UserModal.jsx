import React from 'react';
import { FiLogOut } from 'react-icons/fi';
import './UserModal.css';
import { UserContext } from '../contexts/UserContext';
import { useContext } from 'react';

const UserModal = ({ isOpen, onClose, position }) => {
  const { user, handleLogout: logout } = useContext(UserContext);

  const handleLogout = () => {
    onClose();
    logout()
  };

  const getUserRole = () => {
    return user?.role || 'Rol'
  };

  const getUserInitials = (name) => {
    if (!name) return 'U';
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
            <span>{getUserInitials(user?.name)}</span>
          </div>
          <div className="user-modal-info">
            <h3>{user?.name || 'Cargando...'}</h3>
            <p>{getUserRole()}</p>
          </div>
        </div>

        <div className="user-modal-content">
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