import React, { useState } from 'react';
import { FaUser, FaLock, FaCog, FaShieldAlt, FaEye, FaEyeSlash, FaVolumeUp, FaBell, FaMoon, FaCheck } from 'react-icons/fa';
import { useSidebar } from '../../shared/contexts/SidebarContext.jsx';
import './styles/settings.css';

const Settings = () => {
  const { isCollapsed } = useSidebar();
  
  // Estados para el perfil de usuario
  const [userProfile, setUserProfile] = useState({
    name: 'Jefe de Operaciones',
    email: 'admin@radiopad.com',
    role: 'Administrador'
  });

  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // Estados para preferencias
  const [preferences, setPreferences] = useState({
    soundEffects: true,
    notifications: true,
    darkMode: false
  });

  // Permisos del usuario
  const permissions = [
    'Gestión completa de usuarios',
    'Creación y edición de programas',
    'Acceso a todos los FX',
    'Configuración del sistema',
    'Reportes y estadísticas'
  ];

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handlePreferenceToggle = (preference) => {
    setPreferences(prev => ({
      ...prev,
      [preference]: !prev[preference]
    }));
  };

  const handleUpdatePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    // Aquí iría la lógica para actualizar la contraseña
    alert('Contraseña actualizada correctamente');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  return (
    <div className={`settings-container ${isCollapsed ? 'with-sidebar-collapsed' : ''}`}>
      <div className="settings-header">
        <div className="header-content">
          <h1>Configuración</h1>
          <p>Administra tu cuenta y preferencias del sistema</p>
        </div>
        <button className="save-changes-btn">
          Guardar Cambios
        </button>
      </div>

      <div className="settings-content">
        <div className="settings-grid">
          {/* Perfil de Usuario */}
          <div className="settings-card">
            <div className="card-header">
              <FaUser className="card-icon" />
              <div>
                <h3>Perfil de Usuario</h3>
                <p>Información de tu cuenta</p>
              </div>
            </div>
            <div className="card-content">
              <div className="form-group">
                <label htmlFor="name">Nombre</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={userProfile.name}
                  onChange={handleProfileChange}
                  placeholder="Jefe de Operaciones"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={userProfile.email}
                  onChange={handleProfileChange}
                  placeholder="admin@radiopad.com"
                />
              </div>
              <div className="form-group">
                <label htmlFor="role">Rol Actual</label>
                <div className="role-badge">
                  <span className="role-indicator"></span>
                  {userProfile.role}
                  <small>(Puedes cambiar tu rol desde el menú de usuario)</small>
                </div>
              </div>
            </div>
          </div>

          {/* Cambiar Contraseña */}
          <div className="settings-card">
            <div className="card-header">
              <FaLock className="card-icon" />
              <div>
                <h3>Cambiar Contraseña</h3>
                <p>Actualiza tu contraseña de acceso</p>
              </div>
            </div>
            <div className="card-content">
              <div className="form-group">
                <label htmlFor="currentPassword">Contraseña Actual</label>
                <div className="password-input">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('current')}
                  >
                    {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">Nueva Contraseña</label>
                <div className="password-input">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('new')}
                  >
                    {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                <div className="password-input">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => togglePasswordVisibility('confirm')}
                  >
                    {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <button className="update-password-btn" onClick={handleUpdatePassword}>
                Actualizar Contraseña
              </button>
            </div>
          </div>

          {/* Preferencias */}
          <div className="settings-card">
            <div className="card-header">
              <FaCog className="card-icon" />
              <div>
                <h3>Preferencias</h3>
                <p>Personaliza tu experiencia</p>
              </div>
            </div>
            <div className="card-content">
              <div className="preference-item">
                <div className="preference-info">
                  <FaVolumeUp className="preference-icon" />
                  <div>
                    <h4>Efectos de Sonido</h4>
                    <p>Habilitar sonidos de la interfaz</p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.soundEffects}
                    onChange={() => handlePreferenceToggle('soundEffects')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="preference-item">
                <div className="preference-info">
                  <FaBell className="preference-icon" />
                  <div>
                    <h4>Notificaciones</h4>
                    <p>Recibir notificaciones del sistema</p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.notifications}
                    onChange={() => handlePreferenceToggle('notifications')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
              <div className="preference-item">
                <div className="preference-info">
                  <FaMoon className="preference-icon" />
                  <div>
                    <h4>Modo Oscuro</h4>
                    <p>Cambiar tema de la interfaz</p>
                  </div>
                </div>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={preferences.darkMode}
                    onChange={() => handlePreferenceToggle('darkMode')}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>

          {/* Permisos y Accesos */}
          <div className="settings-card">
            <div className="card-header">
              <FaShieldAlt className="card-icon" />
              <div>
                <h3>Permisos y Accesos</h3>
                <p>Funciones disponibles para tu rol</p>
              </div>
            </div>
            <div className="card-content">
              <div className="permissions-list">
                {permissions.map((permission, index) => (
                  <div key={index} className="permission-item">
                    <FaCheck className="permission-check" />
                    <span>{permission}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;