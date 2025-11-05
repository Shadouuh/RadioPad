import React, { useState, useEffect, useContext } from 'react';
import SoundService from '../../shared/services/SoundService';
import { useMultiAudioPlayer } from '../../shared/contexts/MultiAudioPlayerContext.jsx';
import { UserContext } from '../../shared/contexts/UserContext.jsx';
import { FiPlay, FiTrash2, FiInfo, FiUpload } from 'react-icons/fi';
import { FaMusic as FaMusicNote } from 'react-icons/fa';
import './styles/InstitutionalSounds.css';

/**
 * Componente para mostrar y gestionar los sonidos institucionales
 */
const InstitutionalSounds = () => {
  const [sounds, setSounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSound, setSelectedSound] = useState(null);
  
  // Hooks de contexto
  const { playSound, players } = useMultiAudioPlayer();
  const { user } = useContext(UserContext);

  // Funciones de permisos
  const hasFullAccess = () => {
    return user?.role === 'Jefe de Operadores';
  };

  const canEditInstitutionalSound = () => {
    return hasFullAccess();
  };

  const canPlayInstitutionalSound = () => {
    return true; // Todos pueden reproducir sonidos institucionales
  };

  // Cargar sonidos institucionales al montar el componente
  useEffect(() => {
    const fetchSounds = async () => {
      try {
        setLoading(true);
        const response = await SoundService.getInstitutionalSounds();
        setSounds(response.data || []);
        setError(null);
      } catch (err) {
        setError('Error al cargar los sonidos institucionales');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSounds();
  }, []);

  // Función para reproducir un sonido usando el reproductor global
  const handlePlaySound = (sound) => {
    playSound(sound);
  };

  // Función auxiliar para verificar si un sonido está siendo reproducido
  const isSoundPlaying = (soundId) => {
    return Array.from(players.values()).some(player => 
      player.currentSound && player.currentSound.sound_id === soundId && player.isPlaying
    );
  };

  // Mostrar detalles de un sonido
  const showSoundDetails = (sound) => {
    setSelectedSound(sound);
  };

  // Función para subir nuevo sonido institucional
  const handleUploadSound = () => {
    if (!canEditInstitutionalSound()) {
      alert('No tienes permisos para subir sonidos institucionales');
      return;
    }
    // Aquí iría la lógica para abrir un modal de subida
    alert('Función de subida de sonidos institucionales - En desarrollo');
  };

  // Eliminar un sonido
  const deleteSound = async (soundId) => {
    if (!canEditInstitutionalSound()) {
      alert('No tienes permisos para eliminar sonidos institucionales');
      return;
    }
    if (window.confirm('¿Estás seguro de que deseas eliminar este sonido?')) {
      try {
        await SoundService.deleteSound(soundId);
        setSounds(sounds.filter(sound => sound.sound_id !== soundId));
      } catch (err) {
        console.error('Error al eliminar el sonido:', err);
      }
    }
  };

  // Cerrar el modal de detalles
  const closeDetails = () => {
    setSelectedSound(null);
  };

  return (
    <div className="institutional-sounds-container">
      <div className="page-header">
        <div>
          <h1><FaMusicNote /> Sonidos Institucionales</h1>
          <p>Efectos de sonido disponibles para todos los programas</p>
        </div>
        {canEditInstitutionalSound() && (
          <button className="upload-sound-btn" onClick={handleUploadSound}>
            <FiUpload /> Subir Sonido
          </button>
        )}
      </div>
      
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Cargando sonidos...</p>
        </div>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Reintentar</button>
        </div>
      ) : (
        <>
          {sounds.length === 0 ? (
            <div className="no-sounds-message">
              <p>No hay sonidos institucionales disponibles.</p>
            </div>
          ) : (
            <div className="sounds-grid">
              {sounds.map((sound) => (
                <div key={sound.sound_id} className="sound-card">
                  <div className="sound-card-header">
                    <h3>{sound.sound_name}</h3>
                    <span className="sound-duration">{Math.floor(sound.duration_seconds)}s</span>
                  </div>
                  
                  <div className="sound-card-body">
                    <p className="sound-description">{sound.description || 'Sin descripción'}</p>
                  </div>
                  
                  <div className="sound-card-actions">
                    <button 
                      className={`action-button play-button ${
                        isSoundPlaying(sound.sound_id) ? 'playing' : ''
                      }`}
                      onClick={() => handlePlaySound(sound)}
                      title={
                        isSoundPlaying(sound.sound_id)
                          ? 'Reproduciendo...'
                          : 'Reproducir'
                      }
                    >
                      <FiPlay />
                    </button>
                    
                    <button 
                      className="action-button info-button"
                      onClick={() => showSoundDetails(sound)}
                      title="Ver detalles"
                    >
                      <FiInfo />
                    </button>
                    
                    {canEditInstitutionalSound() && (
                      <button 
                        className="action-button delete-button"
                        onClick={() => deleteSound(sound.sound_id)}
                        title="Eliminar"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Modal de detalles del sonido */}
      {selectedSound && (
        <div className="sound-details-modal">
          <div className="sound-details-content">
            <button className="close-button" onClick={closeDetails}>×</button>
            <h2>{selectedSound.sound_name}</h2>
            
            <div className="sound-details-info">
              <p><strong>Descripción:</strong> {selectedSound.description || 'Sin descripción'}</p>
              <p><strong>Duración:</strong> {selectedSound.duration_seconds.toFixed(2)} segundos</p>
              <p><strong>Tamaño:</strong> {(selectedSound.file_size / 1024 / 1024).toFixed(2)} MB</p>
              <p><strong>Formato:</strong> {selectedSound.file_path.split('.').pop()}</p>
            </div>
            
            <div className="sound-details-actions">
              <button 
                className={`primary-button ${
                  isSoundPlaying(selectedSound.sound_id) ? 'playing' : ''
                }`}
                onClick={() => handlePlaySound(selectedSound)}
                title={
                  isSoundPlaying(selectedSound.sound_id)
                    ? 'Reproduciendo...'
                    : 'Reproducir'
                }
              >
                <FiPlay /> {
                  isSoundPlaying(selectedSound.sound_id)
                    ? 'Reproduciendo...'
                    : 'Reproducir'
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InstitutionalSounds;