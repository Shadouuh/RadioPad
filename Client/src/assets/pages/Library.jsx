import './styles/library.css';
import React, { useState } from 'react';
import useSoundLibrary from './../../hooks/useSoundLibrary';

const UploadSoundForm = () => {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [category, setCategory] = useState([]);

  const {
    uploadSound,
    loading,
    error,
    success,
    sounds, // ⬅️ aquí accedemos a la lista
  } = useSoundLibrary();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (file && name && category.length > 0) {
      uploadSound(file, name, category);
      setFile(null);  // Limpia el input
      setName('');
      setCategory([]);
    } else {
      alert('Por favor complete todos los campos');
    }
  };

  return (
    <div className="upload-container">
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <input
          type="text"
          placeholder="Nombre del sonido"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          multiple
          value={category}
          onChange={(e) =>
            setCategory([...e.target.selectedOptions].map((o) => o.value))
          }
          required
        >
          <option value="Jingles">Jingles</option>
          <option value="Efectos">Efectos</option>
          <option value="Intros">Intros</option>
          <option value="Outros">Outros</option>
        </select>

        <button type="submit" disabled={loading}>
          Subir sonido
        </button>

        {loading && <p>Cargando...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>¡Sonido subido exitosamente!</p>}
      </form>

      {/* Lista de sonidos */}
      <div className="sound-list">
        <h2>Sonidos guardados</h2>
        {sounds.length === 0 ? (
          <p>No hay sonidos todavía.</p>
        ) : (
          sounds.map((sound) => (
            <div key={sound.id} className="sound-item">
              <h4>{sound.name}</h4>
              <p>Categorías: {sound.category.join(', ')}</p>
              <audio controls src={sound.sound}></audio>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UploadSoundForm;
