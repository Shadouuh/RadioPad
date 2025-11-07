import React, { createContext, useContext, useState, useRef, useCallback } from 'react';
import { UserContext } from './UserContext';

const MultiAudioPlayerContext = createContext();

export const useMultiAudioPlayer = () => {
  const context = useContext(MultiAudioPlayerContext);
  if (!context) {
    throw new Error('useMultiAudioPlayer must be used within a MultiAudioPlayerProvider');
  }
  return context;
};

export const MultiAudioPlayerProvider = ({ children }) => {
  const [players, setPlayers] = useState(new Map());
  const audioRefs = useRef(new Map());
  const { user }= useContext(UserContext);

  // user.config?.effects_sounds (boolean)

  // Función para generar un ID único para cada reproductor
  const generatePlayerId = useCallback(() => {
    return `player_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Función para crear un nuevo reproductor
  const createPlayer = useCallback((sound) => {
    if (!sound || !sound.file_path) return null;

    const playerId = generatePlayerId();
    const audio = new Audio();
    audioRefs.current.set(playerId, audio);

    const initialState = {
      id: playerId,
      isVisible: true,
      isPlaying: false,
      currentSound: sound,
      currentTime: 0,
      duration: 0,
      volume: user?.config?.effects_sounds || 1,
      isMuted: false,
      loading: true,
      zIndex: 999 + players.size // Cada nuevo reproductor aparece encima
    };

    // Event listeners para el audio
    const handleLoadedMetadata = () => {
      setPlayers(prev => new Map(prev.set(playerId, {
        ...prev.get(playerId),
        duration: audio.duration,
        loading: false
      })));
    };

    const handleTimeUpdate = () => {
      setPlayers(prev => new Map(prev.set(playerId, {
        ...prev.get(playerId),
        currentTime: audio.currentTime
      })));
    };

    const handleEnded = () => {
      setPlayers(prev => new Map(prev.set(playerId, {
        ...prev.get(playerId),
        isPlaying: false,
        currentTime: 0
      })));
    };

    const handleLoadStart = () => {
      setPlayers(prev => new Map(prev.set(playerId, {
        ...prev.get(playerId),
        loading: true
      })));
    };

    const handleCanPlay = () => {
      setPlayers(prev => new Map(prev.set(playerId, {
        ...prev.get(playerId),
        loading: false
      })));
    };

    const handleError = () => {
      setPlayers(prev => new Map(prev.set(playerId, {
        ...prev.get(playerId),
        loading: false
      })));
      console.error('Error al cargar el audio');
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    // Configurar y reproducir el audio
    audio.src = sound.file_path;
    audio.volume = user?.config?.effects_sounds || initialState.volume;

    audio.play()
      .then(() => {
        setPlayers(prev => new Map(prev.set(playerId, {
          ...prev.get(playerId),
          isPlaying: true,
          loading: false
        })));
      })
      .catch((error) => {
        console.error('Error al reproducir el audio:', error);
        setPlayers(prev => new Map(prev.set(playerId, {
          ...prev.get(playerId),
          loading: false
        })));
      });

    setPlayers(prev => new Map(prev.set(playerId, initialState)));
    return playerId;
  }, [generatePlayerId, players.size]);

  // Función para reproducir un sonido (crear nuevo reproductor o usar existente)
  const playSound = useCallback((sound) => {
    if (!sound || !sound.file_path) return;

    // Buscar si ya existe un reproductor para este sonido
    const existingPlayer = Array.from(players.entries()).find(
      ([_, player]) => player.currentSound && player.currentSound.sound_id === sound.sound_id
    );

    if (existingPlayer) {
      const [playerId, player] = existingPlayer;
      const audio = audioRefs.current.get(playerId);
      
      if (player.isPlaying) {
        // Pausar si ya está reproduciendo
        audio.pause();
        setPlayers(prev => new Map(prev.set(playerId, {
          ...prev.get(playerId),
          isPlaying: false
        })));
      } else {
        // Reanudar reproducción
        audio.play()
          .then(() => {
            setPlayers(prev => new Map(prev.set(playerId, {
              ...prev.get(playerId),
              isPlaying: true
            })));
          })
          .catch((error) => {
            console.error('Error al reanudar el audio:', error);
          });
      }
    } else {
      // Crear nuevo reproductor
      createPlayer(sound);
    }
  }, [players, createPlayer]);

  // Función para pausar un reproductor específico
  const pausePlayer = useCallback((playerId) => {
    const audio = audioRefs.current.get(playerId);
    if (audio) {
      audio.pause();
      setPlayers(prev => new Map(prev.set(playerId, {
        ...prev.get(playerId),
        isPlaying: false
      })));
    }
  }, []);

  // Función para reanudar un reproductor específico
  const resumePlayer = useCallback((playerId) => {
    const audio = audioRefs.current.get(playerId);
    if (audio) {
      audio.play()
        .then(() => {
          setPlayers(prev => new Map(prev.set(playerId, {
            ...prev.get(playerId),
            isPlaying: true
          })));
        })
        .catch((error) => {
          console.error('Error al reanudar el audio:', error);
        });
    }
  }, []);

  // Función para cambiar el tiempo de reproducción
  const seekTo = useCallback((playerId, time) => {
    const audio = audioRefs.current.get(playerId);
    if (audio && !isNaN(time)) {
      audio.currentTime = time;
      setPlayers(prev => new Map(prev.set(playerId, {
        ...prev.get(playerId),
        currentTime: time
      })));
    }
  }, []);

  // Función para cambiar el volumen
  const changeVolume = useCallback((playerId, newVolume) => {
    const audio = audioRefs.current.get(playerId);
    const player = players.get(playerId);
    if (audio && player) {
      const clampedVolume = Math.max(0, Math.min(1, newVolume));
      
      setPlayers(prev => new Map(prev.set(playerId, {
        ...prev.get(playerId),
        volume: clampedVolume
      })));
      
      if (!player.isMuted) {
        audio.volume = clampedVolume;
      }
    }
  }, [players]);

  // Función para mutear/desmutear
  const toggleMute = useCallback((playerId) => {
    const audio = audioRefs.current.get(playerId);
    const player = players.get(playerId);
    if (audio && player) {
      const newMutedState = !player.isMuted;
      
      setPlayers(prev => new Map(prev.set(playerId, {
        ...prev.get(playerId),
        isMuted: newMutedState
      })));
      
      audio.volume = newMutedState ? 0 : player.volume;
    }
  }, [players]);

  // Función para cerrar un reproductor
  const closePlayer = useCallback((playerId) => {
    const audio = audioRefs.current.get(playerId);
    if (audio) {
      audio.pause();
      audio.src = '';
      audioRefs.current.delete(playerId);
    }
    
    setPlayers(prev => {
      const newPlayers = new Map(prev);
      newPlayers.delete(playerId);
      return newPlayers;
    });
  }, []);

  // Función para formatear el tiempo
  const formatTime = useCallback((time) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const value = {
    players,
    createPlayer,
    playSound,
    pausePlayer,
    resumePlayer,
    seekTo,
    changeVolume,
    toggleMute,
    closePlayer,
    formatTime
  };

  return (
    <MultiAudioPlayerContext.Provider value={value}>
      {children}
    </MultiAudioPlayerContext.Provider>
  );
};

export default MultiAudioPlayerContext;