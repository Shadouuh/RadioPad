import React, { useState, useEffect, useRef } from 'react';
import { LuSave, LuX, LuMail, LuLock, LuUser, LuCheck, LuUpload, LuImage } from 'react-icons/lu';
import './styles/config.css';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../firebase/config';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential, updateEmail } from 'firebase/auth';
import useCloudinary from '../../hooks/useCloudinary';

const Config = () => {
  const { currentUser } = useAuth();
  const [username, setUsername] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [emailVerificationSent, setEmailVerificationSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const fileInputRef = useRef(null);
  const { uploadProfilePicture, loading: imageLoading } = useCloudinary();
  
  // Cargar datos del usuario cuando el componente se monta
  useEffect(() => {
    if (currentUser) {
      // Establecer el email del usuario actual
      setEmail(currentUser.email || '');
      
      // Si el usuario tiene un displayName, usarlo como nombre de usuario
      // De lo contrario, usar la primera parte del email
      if (currentUser.displayName) {
        setUsername(currentUser.displayName);
      } else if (currentUser.email) {
        // Extraer el nombre de usuario del email (parte antes del @)
        const emailUsername = currentUser.email.split('@')[0];
        setUsername(emailUsername);
      }
      
      // Cargar la foto de perfil si existe
      if (currentUser.photoURL) {
        setPreviewImage(currentUser.photoURL);
      } else {
        // Intentar obtener la foto de perfil desde Firestore
        const fetchProfilePicture = async () => {
          try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            const userDoc = await getDoc(userDocRef);
            
            if (userDoc.exists() && userDoc.data().profilePicture?.url) {
              setPreviewImage(userDoc.data().profilePicture.url);
            }
          } catch (error) {
            console.error('Error al obtener la foto de perfil:', error);
          }
        };
        
        fetchProfilePicture();
      }
    }
  }, [currentUser]);

  const avatarColors = [
    '#3b82f6', 
    '#8b5cf6', 
    '#06b6d4', 
    '#ec4899', 
    '#f97316'  
  ];

  // Manejar cambio de imagen de perfil
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      
      // Crear una URL para previsualizar la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveChanges = async () => {
    console.log('Saving changes...');
    console.log('Current user:', currentUser);
    
    setLoading(true);
    setError('');
    setSuccessMessage('');
    
    try {
      // Verificar si el usuario está autenticado
      if (!currentUser) {
        throw new Error('No hay usuario autenticado');
      }
      
      // Preparar objeto para actualizar en Firestore
      const userUpdates = {};
      let authUpdated = false;
      
      // Actualizar el nombre de usuario en Firebase Auth
      if (username !== currentUser.displayName) {
        await updateProfile(currentUser, {
          displayName: username
        });
        userUpdates.displayName = username;
        userUpdates.nombre = username.split(' ')[0] || username;
        userUpdates.apellido = username.split(' ')[1] || '';
        authUpdated = true;
      }
      
      // Actualizar el avatar seleccionado
      userUpdates.avatarColor = avatarColors[selectedAvatar];
      
      // Subir imagen de perfil si se ha seleccionado una nueva
      if (profileImage) {
        const uploadResult = await uploadProfilePicture(profileImage, currentUser.uid, currentUser);
        if (uploadResult.success) {
          console.log('Imagen de perfil actualizada:', uploadResult.url);
          // No es necesario actualizar userUpdates aquí ya que uploadProfilePicture ya actualiza Firestore
        } else {
          console.error('Error al subir imagen de perfil:', uploadResult.error);
        }
      }
      
      // Cambiar contraseña si se proporcionó una nueva
      if (currentPassword && newPassword && confirmPassword) {
        if (newPassword !== confirmPassword) {
          throw new Error('Las contraseñas nuevas no coinciden');
        }
        
        if (newPassword.length < 6) {
          throw new Error('La contraseña debe tener al menos 6 caracteres');
        }
        
        // Re-autenticar al usuario antes de cambiar la contraseña
        try {
          const credential = EmailAuthProvider.credential(
            currentUser.email,
            currentPassword
          );
          
          await reauthenticateWithCredential(currentUser, credential);
          await updatePassword(currentUser, newPassword);
          
          // Limpiar los campos de contraseña
          setCurrentPassword('');
          setNewPassword('');
          setConfirmPassword('');
          authUpdated = true;
        } catch (authError) {
          if (authError.code === 'auth/wrong-password') {
            throw new Error('La contraseña actual es incorrecta');
          } else {
            throw new Error('Error al cambiar la contraseña: ' + authError.message);
          }
        }
      }
      
      // Actualizar email si se ha verificado
      if (emailVerificationSent && newEmail && newEmail !== email) {
        try {
          // En una implementación real, aquí verificaríamos que el código de verificación es correcto
          // y luego actualizaríamos el email
          
          // Re-autenticar al usuario si no lo hemos hecho ya
          if (!authUpdated && currentPassword) {
            const credential = EmailAuthProvider.credential(
              currentUser.email,
              currentPassword
            );
            await reauthenticateWithCredential(currentUser, credential);
          } else if (!authUpdated && !currentPassword) {
            throw new Error('Debes proporcionar tu contraseña actual para cambiar el email');
          }
          
          await updateEmail(currentUser, newEmail);
          userUpdates.email = newEmail;
          setEmail(newEmail);
          setNewEmail('');
          setEmailVerificationSent(false);
          authUpdated = true;
        } catch (emailError) {
          console.error('Error al actualizar email:', emailError);
          throw new Error('Error al actualizar email: ' + emailError.message);
        }
      }
      
      // Actualizar datos en Firestore si hay cambios
      if (Object.keys(userUpdates).length > 0) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            await updateDoc(userDocRef, userUpdates);
            console.log('Datos actualizados en Firestore:', userUpdates);
          } else {
            console.log('No existe documento del usuario en Firestore');
          }
        } catch (firestoreError) {
          console.error('Error al actualizar datos en Firestore:', firestoreError);
          // No interrumpimos el flujo si falla la actualización en Firestore
        }
      }
      
      setSuccessMessage('¡Cambios guardados correctamente!');
    } catch (error) {
      console.error('Error al guardar cambios:', error);
      setError(error.message || 'Error al guardar los cambios');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    console.log('Cancelling changes...');
    
    // Restablecer los valores originales
    if (currentUser) {
      // Restablecer email
      setEmail(currentUser.email || '');
      setNewEmail('');
      setEmailVerificationSent(false);
      
      // Restablecer nombre de usuario
      if (currentUser.displayName) {
        setUsername(currentUser.displayName);
      } else if (currentUser.email) {
        const emailUsername = currentUser.email.split('@')[0];
        setUsername(emailUsername);
      }
      
      // Restablecer contraseñas
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Limpiar mensajes
      setError('');
      setSuccessMessage('');
    }
  };

  const sendVerificationEmail = async () => {
    if (!newEmail) {
      setError('Por favor, ingresa un nuevo correo electrónico');
      return;
    }
    
    if (newEmail === email) {
      setError('El nuevo correo electrónico debe ser diferente al actual');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      // En una implementación real, aquí se enviaría un correo de verificación
      // usando Firebase o algún otro servicio
      
      // Simulamos el envío del correo
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setEmailVerificationSent(true);
      console.log(`Verification email sent to ${newEmail}`);
    } catch (error) {
      console.error('Error al enviar correo de verificación:', error);
      setError('Error al enviar correo de verificación');
    } finally {
      setLoading(false);
    }
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
                    {username ? username.substring(0, 2).toUpperCase() : ''}
                  </button>
                ))}
              </div>
              {/*
              <div className="profile-image-section">
                <br />
                
                <p>O personaliza tu avatar</p>
                <div className="profile-image-container">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Foto de perfil" 
                      className="profile-image-preview" 
                    />
                  ) : (
                    <div className="profile-image-placeholder">
                      <LuImage size={40} />
                      <p>Sin imagen</p>
                    </div>
                  )}
                    
                  
                </div>
                
                <div className="file-input-container">
                  <input 
                    type="file" 
                    id="avatar-file" 
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  <button 
                    type="button" 
                    className="upload-btn" 
                    onClick={() => fileInputRef.current.click()}
                  >
                    <LuUpload /> Subir imagen
                  </button>
                </div>
              </div>
              */}
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

      { error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="success-message">
          <LuCheck /> {successMessage}
        </div>
      )}
      
      <div className="config-actions">
        <button className="cancel-btn" onClick={handleCancel} disabled={loading}>
          <LuX /> Cancelar
        </button>
        <button className="save-btn" onClick={handleSaveChanges} disabled={loading}>
          {loading ? 'Guardando...' : <><LuSave /> Guardar Cambios</>}
        </button>
      </div>
    </div>
  );
};

export default Config;