import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioPlayerContext = createContext();

export const useAudioPlayer = () => {
  const context = useContext(AudioPlayerContext);
  if (!context) {
    throw new Error('useAudioPlayer must be used within an AudioPlayerProvider');
  }
  return context;
};

export const AudioPlayerProvider = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSound, setCurrentSound] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const audioRef = useRef(null);
  const progressIntervalRef = useRef(null);

  // Inicializar el elemento de audio
  useEffect(() => {
    audioRef.current = new Audio();
    
    const audio = audioRef.current;
    
    // Event listeners para el audio
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setLoading(false);
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      clearInterval(progressIntervalRef.current);
    };
    
    const handleLoadStart = () => {
      setLoading(true);
    };
    
    const handleCanPlay = () => {
      setLoading(false);
    };
    
    const handleError = () => {
      setLoading(false);
      console.error('Error al cargar el audio');
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Función para reproducir un sonido
  const playSound = (sound) => {
    if (!sound || !sound.file_path) return;
    
    const audio = audioRef.current;
    
    // Si es el mismo sonido, solo pausar/reanudar
    if (currentSound && currentSound.sound_id === sound.sound_id) {
      if (isPlaying) {
        pause();
      } else {
        resume();
      }
      return;
    }
    
    // Nuevo sonido
    setCurrentSound(sound);
    setIsVisible(true);
    setLoading(true);
    
    audio.src = sound.file_path;
    audio.volume = isMuted ? 0 : volume;
    
    audio.play()
      .then(() => {
        setIsPlaying(true);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error al reproducir el audio:', error);
        setLoading(false);
      });
  };

  // Función para pausar
  const pause = () => {
    const audio = audioRef.current;
    audio.pause();
    setIsPlaying(false);
  };

  // Función para reanudar
  const resume = () => {
    const audio = audioRef.current;
    audio.play()
      .then(() => {
        setIsPlaying(true);
      })
      .catch((error) => {
        console.error('Error al reanudar el audio:', error);
      });
  };

  // Función para cambiar el tiempo de reproducción
  const seekTo = (time) => {
    const audio = audioRef.current;
    if (audio && !isNaN(time)) {
      audio.currentTime = time;
      setCurrentTime(time);
    }
  };

  // Función para cambiar el volumen
  const changeVolume = (newVolume) => {
    const audio = audioRef.current;
    const clampedVolume = Math.max(0, Math.min(1, newVolume));
    
    setVolume(clampedVolume);
    if (audio && !isMuted) {
      audio.volume = clampedVolume;
    }
  };

  // Función para mutear/desmutear
  const toggleMute = () => {
    const audio = audioRef.current;
    const newMutedState = !isMuted;
    
    setIsMuted(newMutedState);
    if (audio) {
      audio.volume = newMutedState ? 0 : volume;
    }
  };

  // Función para cerrar el reproductor
  const closePlayer = () => {
    const audio = audioRef.current;
    audio.pause();
    setIsPlaying(false);
    setIsVisible(false);
    setCurrentSound(null);
    setCurrentTime(0);
    setDuration(0);
  };

  // Función para formatear el tiempo
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const value = {
    // Estado
    isVisible,
    isPlaying,
    currentSound,
    currentTime,
    duration,
    volume,
    isMuted,
    loading,
    
    // Funciones
    playSound,
    pause,
    resume,
    seekTo,
    changeVolume,
    toggleMute,
    closePlayer,
    formatTime
  };

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
    </AudioPlayerContext.Provider>
  );
};

export default AudioPlayerContext;