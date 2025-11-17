import React, { useMemo, useState, useEffect } from 'react';
import { FiPlay, FiPause, FiX } from 'react-icons/fi';
import { useMultiAudioPlayer } from '../contexts/MultiAudioPlayerContext.jsx';
import './styles/Soundboard.css';

const SoundButton = React.memo(({ sound, isPlaying, onPlay }) => {
  const durationLabel = typeof sound.duration === 'number'
    ? `${Math.floor(sound.duration)}s`
    : (sound.duration || 'N/A');

  return (
    <button
      className={`soundboard-item ${isPlaying ? 'playing' : ''}`}
      onClick={() => onPlay(sound)}
      title={isPlaying ? 'Reproduciendo...' : 'Reproducir'}
    >
      <div className="item-header">
        <h3 className="item-title">{sound.name}</h3>
        <span className="item-duration">{durationLabel}</span>
      </div>
      <div className="item-body">
        <span className="item-description">{sound.description || 'Sin descripción'}</span>
      </div>
      <div className="item-action">
        {isPlaying ? (
          <FiPause className="play-icon" />
        ) : (
          <FiPlay className="play-icon" />
        )}
      </div>
    </button>
  );
});

const Soundboard = ({ sounds = [] }) => {
  const { playSound, players } = useMultiAudioPlayer();
  const [open, setOpen] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    setFiltered(sounds);
  }, [sounds]);

  // Evitar scroll del body cuando el modal está abierto (full screen consistente)
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      setFiltered(sounds);
      return;
    }
    setFiltered(
      sounds.filter((s) =>
        (s.name || '').toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q)
      )
    );
  }, [query, sounds]);

  const playingIds = useMemo(() => {
    const list = new Set();
    players.forEach((player) => {
      const current = player.currentSound;
      if (!current) return;
      if (player.isPlaying && (current.id != null || current.sound_id != null)) {
        list.add(String(current.id ?? current.sound_id));
      }
    });
    return list;
  }, [players]);

  const isSoundPlaying = (sound) => {
    const id = sound?.id ?? sound?.sound_id;
    if (id != null) return playingIds.has(String(id));
    // fallback compare by path
    let playing = false;
    players.forEach((p) => {
      if (p.isPlaying && p.currentSound?.file_path && sound?.file_path) {
        if (p.currentSound.file_path === sound.file_path) playing = true;
      }
    });
    return playing;
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePlay = (sound) => {
    if (!sound) return;
    playSound(sound);
  };

  return (
    <div className="soundboard-root">
      <button className="open-button" onClick={handleOpen}>Acceder a botonera</button>

      {open && (
        <div className="soundboard-modal" role="dialog" aria-modal="true">
          <div className="modal-backdrop" onClick={handleClose} />
          <div className="modal-content">
            <header className="modal-header">
              <h2 className="modal-title">Botonera de Efectos</h2>
              <div className="modal-controls">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Buscar..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button className="close-button" onClick={handleClose} aria-label="Cerrar">
                  <FiX />
                </button>
              </div>
            </header>

            <section className="modal-body">
              <div className="soundboard-grid">
                {filtered.map((sound) => (
                  <SoundButton
                    key={sound.id ?? sound.sound_id ?? sound.file_path}
                    sound={sound}
                    isPlaying={isSoundPlaying(sound)}
                    onPlay={handlePlay}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default Soundboard;