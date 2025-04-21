import './styles/library.css';
import { useEffect, useState } from 'react';
import useSoundLibrary from './../../hooks/useSoundLibrary';
import { collection, getDocs, getFirestore, doc, getDoc } from 'firebase/firestore';

const UploadSoundForm = () => {
  const db = getFirestore();

  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [programId, setProgramId] = useState('');
  const [category, setCategory] = useState([]);
  const [programs, setPrograms] = useState([]);

  const {
    uploadSound,
    loading,
    error,
    success,
    sounds,
    fetchSounds
  } = useSoundLibrary();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file && name && category.length > 0 && programId) {
      await uploadSound(file, name, category, programId);
      // Reset form after successful upload
      setFile(null);
      setName('');
      setCategory([]);
      // Refresh sounds list
      fetchSounds();
    } else {
      alert('Por favor complete todos los campos');
    }
  };

  const handleProgramChange = (e) => {
    setProgramId(e.target.value);
  };

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const programsRef = collection(db, 'programs');
        const programsSnapshot = await getDocs(programsRef);
        const programsList = programsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }));
        setPrograms(programsList);

        // Set default program if available
        if (programsList.length > 0 && !programId) {
          setProgramId(programsList[0].id);
        }
      } catch (error) {
        console.error("Error fetching programs:", error);
      }
    };

    fetchPrograms();
    fetchSounds();
  }, []);

  return (
    <div className="upload-container">
      <form onSubmit={handleSubmit}>
        <label htmlFor="file-input">Archivo de Audio:</label>
        <input
          className='inputs'
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <label htmlFor="sound-name">Nombre del Sonido:</label>
        <input
          className='inputs'
          type="text"
          placeholder="Nombre del sonido"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label htmlFor="program-select">Programa:</label>
        <select
          className='inputs'
          name="programs"
          value={programId}
          onChange={handleProgramChange}
          required
        >
          {programs.map((program) => (
            <option key={program.id} value={program.id}>
              {program.name}
            </option>
          ))}
        </select>

        <label htmlFor="category-select">Categoría:</label>
        <select
          className='inputs'
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

        <button type="submit" className='btn btn-subir' disabled={loading}>
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
          sounds.map((sound, index) => (
            <div key={index} className="sound-item">
              <h4>{sound.name}</h4>
              <p>Categoria: {sound.category} </p>
              <p>Programa: {sound.programName}</p>
              <audio controls src={sound.archive}></audio>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UploadSoundForm;
