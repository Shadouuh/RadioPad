import React, { useContext, useEffect, useState } from 'react';
import { FaUser, FaLock, FaShieldAlt, FaEye, FaEyeSlash, FaCheck, FaEnvelope } from 'react-icons/fa';
import { useSidebar } from '../../shared/contexts/SidebarContext.jsx';
import './styles/settings.css';
import { UserContext } from '../../shared/contexts/UserContext.jsx';
import axios from '../../shared/api/axios.js';

const Settings = () => {
  const { isCollapsed } = useSidebar();
  const { user, loading } = useContext(UserContext);

  // Estados para el perfil de usuario
  const [userProfile, setUserProfile] = useState({
    name: user?.name || '',
    email: user?.email || '',
    role: user?.role || ''
  });


  useEffect(() => {
    if (user) {
      setUserProfile({
        name: user.name || '',
        email: user.email || '',
        role: user.role || ''
      });
      // Preferencias eliminadas de la interfaz
    }
  }, [user, loading]);

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

  // Permisos del usuario
  const permissions = user?.role === 'Jefe de Operadores' ? [
    'Gestión completa de usuarios',
    'Administracion de programas',
    'Gestion de FXs institucionales',
    'Acceso a todos los FX',
    'Configuración personalizada',
    'Reportes y estadísticas'
  ] : user?.role === 'Operador' ? [
    'Acceso a los programas asignados',
    'Acceso a FXs institucionales',
    'Gestion de FXs de los programas asignados',
    'Configuración personalizada',
  ] : [
    'Acceso a los programas asignados',
    'Acceso a FXs institucionales',
    'Configuración personalizada',
  ];

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

  // Helper para iniciales del usuario
  const getUserInitials = (name) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await axios.put('/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      if (response.data?.success) {
        alert('Contraseña actualizada correctamente');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        alert('Error al actualizar contraseña');
      }
    } catch (err) {
      alert('Error al actualizar contraseña');
      console.error(err?.response?.data?.message || 'Error al actualizar contraseña:', err);
    }

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
      </div>

      <div className="settings-content">
        <div className="settings-grid">
          {/* Perfil de Usuario (mejorado) */}
          <div className="settings-card">
            <div className="card-header">
              <FaUser className="card-icon" />
              <div>
                <h3>Perfil de Usuario</h3>
                <p>Información de tu cuenta</p>
              </div>
            </div>
            {loading ? (
              <h2 className="sidebar-user-loading">Cargando... </h2>
            ) : (
              <div className="card-content user-profile-highlight">
                <div className="user-profile-top">
                  <div className="user-avatar-big">
                    <span>{getUserInitials(userProfile.name)}</span>
                  </div>
                  <div className="user-ident">
                    <h2 className="user-name-highlight">{userProfile.name}</h2>
                    <p className="user-email-line"><FaEnvelope /> {userProfile.email}</p>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="role">Rol Actual</label>
                  <div className="role-badge emphasized">
                    <span className="role-indicator"></span>
                    {userProfile.role}
                    <small>Estado de permisos</small>
                  </div>
                </div>
              </div>
            )}
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

          {/* Preferencias removidas según solicitud */}

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