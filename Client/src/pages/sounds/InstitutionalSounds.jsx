import React, { useState, useEffect, useContext } from 'react';
import SoundService from '../../shared/services/SoundService';
import { useMultiAudioPlayer } from '../../shared/contexts/MultiAudioPlayerContext.jsx';
import { UserContext } from '../../shared/contexts/UserContext.jsx';
import { FiPlay, FiTrash2, FiInfo, FiUpload, FiEdit } from 'react-icons/fi';
import { FaMusic as FaMusicNote } from 'react-icons/fa';
import './styles/InstitutionalSounds.css';
import SoundModal from './SoundModal.jsx'
import { useSidebar } from '../../shared/contexts/SidebarContext.jsx';
import Soundboard from '../../shared/components/Soundboard.jsx';

/**
 * Componente para mostrar y gestionar los sonidos institucionales
 */
const InstitutionalSounds = () => {
  const [sounds, setSounds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSound, setSelectedSound] = useState(null);
  const [soundModalOpen, setSoundModalOpen] = useState(false);
  const [editingSound, setEditingSound] = useState(null);
  
  // Hooks de contexto
  const { playSound, players } = useMultiAudioPlayer();
  const { user } = useContext(UserContext);
  const { isCollapsed } = useSidebar();

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
    // Abrir modal de subida
    setEditingSound(null);
    setSoundModalOpen(true);
  };

  // Función para editar un sonido
  const handleEditSound = (sound) => {
    if (!canEditInstitutionalSound()) {
      alert('No tienes permisos para editar sonidos institucionales');
      return;
    }
    console.log('handleEditSound - sound object:', sound);
    setEditingSound(sound);
    setSoundModalOpen(true);
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

  const handleSaveSound = async (soundData) => {
    if (!canEditInstitutionalSound()) {
      alert('No tienes permisos para subir sonidos institucionales');
      return;
    }
    
    // Debug: Verificar los datos recibidos
    console.log('handleSaveSound received:', soundData);
    
    // Check if soundData is FormData before trying to iterate
    if (soundData instanceof FormData) {
      console.log('FormData entries:');
      for (let [key, value] of soundData.entries()) {
        console.log(key, value);
      }
    } else {
      console.log('soundData is not FormData:', typeof soundData);
      throw new Error('Invalid data format received');
    }
    
    try {
      // Lógica para guardar el sonido
      if (editingSound) {
        // Editar sonido existente
        console.log('Updating sound with ID:', editingSound.sound_id);
        await SoundService.updateSound(editingSound.sound_id, soundData);
      } else {
        // Subir nuevo sonido
        console.log('Uploading new sound');
        await SoundService.uploadSound(soundData);
      }
      
      // Recargar la lista de sonidos después de guardar
      const response = await SoundService.getInstitutionalSounds();
      setSounds(response);
      setSoundModalOpen(false);
      setEditingSound(null);
    } catch (error) {
      console.error('Error al guardar el sonido:', error);
      alert('Error al guardar el sonido. Por favor, inténtalo de nuevo.');
      // Re-throw the error so SoundModal knows it failed
      throw error;
    }
  };

  // Cerrar el modal de detalles
  const closeDetails = () => {
    setSelectedSound(null);
  };

  return (
    <div className={`institutional-sounds-container ${isCollapsed ? 'with-sidebar-collapsed' : ''}`}>
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

      {/* Botonera de efectos: aparece solo si hay sonidos */}
      {Array.isArray(sounds) && sounds.length > 0 && (
        (() => {
          const serverOrigin = (import.meta.env?.VITE_API_URL || '').replace(/\/?api\/?$/, '');
          const sbSounds = sounds.map((s) => {
            const rawPath = s.file_path || s.file_url || s.url || '';
            const isAbsolute = /^https?:\/\//i.test(rawPath);
            const normalizedPath = isAbsolute
              ? rawPath
              : serverOrigin
                ? `${serverOrigin}${rawPath.startsWith('/') ? '' : '/'}${rawPath}`
                : rawPath;
            return {
              id: s.sound_id ?? s.id,
              name: s.sound_name ?? s.name ?? 'Audio',
              description: s.description || 'Efecto institucional',
              duration: s.duration_seconds ?? s.duration,
              file_path: normalizedPath,
            };
          });
          return <Soundboard sounds={sbSounds} />;
        })()
      )}
      
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
                      <>
                        <button 
                          className="action-button edit-button"
                          onClick={() => handleEditSound(sound)}
                          title="Editar"
                        >
                          <FiEdit />
                        </button>
                        
                        <button 
                          className="action-button delete-button"
                          onClick={() => deleteSound(sound.sound_id)}
                          title="Eliminar"
                        >
                          <FiTrash2 />
                        </button>
                      </>
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

      {/* Modal de subida de sonido */}
      <SoundModal
        isOpen={soundModalOpen}
        onClose={() => {
          setSoundModalOpen(false);
          setEditingSound(null);
        }}
        onSave={handleSaveSound}
        sound={editingSound}
      />

    </div>
  );
};

export default InstitutionalSounds;