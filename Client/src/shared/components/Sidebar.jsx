import React, { useState, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiUsers, 
  FiSettings, 
  FiMenu,
  FiRadio,
  FiX,
  FiBarChart,
  FiMusic
} from 'react-icons/fi';
import { useSidebar } from '../contexts/SidebarContext';
import UserModal from './UserModal.jsx';
import './styles/Sidebar.css';

const Sidebar = () => {
  const { isCollapsed, toggleSidebar } = useSidebar();
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [modalPosition, setModalPosition] = useState({ bottom: '20px', left: '20px' });
  const userSectionRef = useRef(null);

  const handleUserClick = () => {
    if (userSectionRef.current) {
      const rect = userSectionRef.current.getBoundingClientRect();
      setModalPosition({
        bottom: `${window.innerHeight - rect.top}px`,
        left: isCollapsed ? '100px' : '300px'
      });
    }
    setIsUserModalOpen(true);
  };

  const closeUserModal = () => {
    setIsUserModalOpen(false);
  };

  // Generar iniciales del usuario (estático)
  const getUserInitials = () => {
    return 'JO';
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Logo with Toggle Button */}
      <div className="sidebar-header">
        <div className="sidebar-logo" onClick={isCollapsed ? toggleSidebar : undefined} style={{cursor: isCollapsed ? 'pointer' : 'default'}}>
          <FiRadio className="logo-icon" />
          {!isCollapsed && <span className="logo-text">RadioPad</span>}
        </div>
        <button onClick={toggleSidebar} className="toggle-btn">
          {isCollapsed ? <FiMenu /> : <FiX />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          data-tooltip="Dashboard"
        >
          <FiHome className="nav-icon" />
          {!isCollapsed && <span className="nav-text">Dashboard</span>}
        </NavLink>
        
        <NavLink 
          to="/programs" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          data-tooltip="Programas"
        >
          <FiBarChart className="nav-icon" />
          {!isCollapsed && <span className="nav-text">Programas</span>}
        </NavLink>
        
        <NavLink 
          to="/sounds/institutional" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          data-tooltip="Sonidos"
        >
          <FiMusic className="nav-icon" />
          {!isCollapsed && <span className="nav-text">Sonidos</span>}
        </NavLink>
        
        <NavLink 
          to="/users" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          data-tooltip="Usuarios"
        >
          <FiUsers className="nav-icon" />
          {!isCollapsed && <span className="nav-text">Usuarios</span>}
        </NavLink>
        
        <NavLink 
          to="/settings" 
          className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          data-tooltip="Configuración"
        >
          <FiSettings className="nav-icon" />
          {!isCollapsed && <span className="nav-text">Configuración</span>}
        </NavLink>
      </nav>

      {/* User Profile */}
      <div 
        className="sidebar-user" 
        ref={userSectionRef}
        onClick={handleUserClick}
      >
        <div className="sidebar-user-avatar">
          <span>{getUserInitials()}</span>
        </div>
        {!isCollapsed && (
          <div className="sidebar-user-info">
            <span className="sidebar-user-name">Jefe de Operaciones</span>
            <span className="sidebar-user-role">Administrador</span>
          </div>
        )}
      </div>

      {/* User Modal */}
      <UserModal 
        isOpen={isUserModalOpen}
        onClose={closeUserModal}
        position={modalPosition}
      />
    </aside>
  );
};

export default Sidebar;