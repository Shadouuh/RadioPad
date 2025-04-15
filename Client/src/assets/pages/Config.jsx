import React, { useState } from 'react';
import { LuSave, LuX, LuMail, LuLock, LuUser } from 'react-icons/lu';
import './styles/config.css';

const Config = () => {
  const [username, setUsername] = useState('johnsmith');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('john.smith@example.com');
  const [newEmail, setNewEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);

  const avatarColors = [
    '#3b82f6', 
    '#8b5cf6', 
    '#06b6d4', 
    '#ec4899', 
    '#f97316'  
  ];

  const handleSaveChanges = () => {
    console.log('Saving changes...');
  };

  const handleCancel = () => {
    console.log('Cancelling changes...');
  };

  const sendVerificationEmail = () => {
    setEmailVerificationSent(true);
    console.log(`Verification email sent to ${newEmail}`);
  };

  return (
    <div className="config-container">
      <div className="config-header">
        <h1>Configuración</h1>
        <p>Gestiona tu perfil y preferencias</p>
      </div>

      <div className="config-content">
        <div className="profile-section">
          <div>
            <div className="avatar-section">
              <h2>Avatar</h2>
              <p>Elige un avatar para tu perfil</p>
              
              <div className="avatar-options">
                {avatarColors.map((color, index) => (
                  <button 
                    key={index}
                    className={`avatar-option ${selectedAvatar === index ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedAvatar(index)}
                  >
                    JS
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="username"><LuUser /> Nombre de Usuario</label>
              <input 
                type="text" 
                id="username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
              />
            </div>
          </div>

          <div>
            <div className="email-section">
              <h2 className="section-title"><LuMail /> Cambiar Email</h2>
              
              <div className="form-group">
                <label htmlFor="current-email">Email Actual</label>
                <input 
                  type="email" 
                  id="current-email" 
                  value={email} 
                  disabled 
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="new-email">Nuevo Email</label>
                <input 
                  type="email" 
                  id="new-email" 
                  value={newEmail} 
                  onChange={(e) => setNewEmail(e.target.value)} 
                  placeholder="Ingresa tu nuevo email"
                />
              </div>
              
              {!emailVerificationSent ? (
                <button className="verification-btn" onClick={sendVerificationEmail}>
                  Enviar Código de Verificación
                </button>
              ) : (
                <div className="verification-info">
                  <p>Se ha enviado un código de verificación a {newEmail}. Por favor, revisa tu bandeja de entrada y sigue las instrucciones para completar el cambio de email.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="section-divider"></div>

        <div className="password-section">
          <h2 className="section-title"><LuLock /> Cambiar Contraseña</h2>
          
          <div className="form-group">
            <label htmlFor="current-password">Contraseña Actual</label>
            <input 
              type="password" 
              id="current-password" 
              value={currentPassword} 
              onChange={(e) => setCurrentPassword(e.target.value)} 
            />
          </div>

          <div className="password-row">
            <div className="form-group">
              <label htmlFor="new-password">Nueva Contraseña</label>
              <input 
                type="password" 
                id="new-password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirm-password">Confirmar Contraseña</label>
              <input 
                type="password" 
                id="confirm-password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="config-actions">
        <button className="cancel-btn" onClick={handleCancel}>
          <LuX /> Cancelar
        </button>
        <button className="save-btn" onClick={handleSaveChanges}>
          <LuSave /> Guardar Cambios
        </button>
      </div>
    </div>
  );
};

export default Config;