import { useState, useEffect } from 'react';
import { uploadAudioToCloudinary } from '../api/cloudinaryService';
import { getFirestore, doc, getDoc, updateDoc, arrayUnion, getDocs, collection } from 'firebase/firestore';

const useSoundLibrary = () => {
  //Manejos de estado
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [sounds, setSounds] = useState([]);

  //Se conecta a fire
  const db = getFirestore();

  // Subrir los temazos a claudio 💀
  const uploadSound = async (file, name, category, programId) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Subida a Claudio
      const audioUploadResponse = await uploadAudioToCloudinary(file);

      if (!audioUploadResponse.success) {
        throw new Error(audioUploadResponse.error || 'Error desconocido al subir audio');
      }

      const { url } = audioUploadResponse;//Esto extrae la url de lo que esta subido a claudio

      // Crear el objeto de sonido que se agregará al array
      const soundData = {
        name,
        category,
        archive: url,
      };

      // Referencia al documento del programa
      const programRef = doc(db, 'programs', programId);

      // Verificar que el programa existe
      const programDoc = await getDoc(programRef);
      if (!programDoc.exists()) {
        throw new Error('El programa especificado no existe');
      }

      // Actualizar el array de soundEffects en el documento del programa
      await updateDoc(programRef, {
        soundEffects: arrayUnion(soundData)
      });

      setSuccess(true);
      // Después de subir, actualizamos la lista
      await fetchSounds();
    } catch (err) {
      setError(err.message || 'Hubo un problema al subir el sonido.');
    } finally {
      setLoading(false);
    }
  };

  // Obtener los Efectos de sonido del programa específico
  const fetchSounds = async () => {
    try {
      const programRef = collection(db, 'programs');
      const programSnapshot = await getDocs(programRef);
      
      // Flatten the array of sound effects from all programs
      const allSounds = [];
      programSnapshot.docs.forEach(doc => {
        const program = doc.data();
        const programId = doc.id;
        
        if (program.soundEffects && Array.isArray(program.soundEffects)) {
          // Add program info to each sound
          const programSounds = program.soundEffects.map(sound => ({
            ...sound,
            programId,
            programName: program.name
          }));
          allSounds.push(...programSounds);
        }
      });
      
      setSounds(allSounds);
      console.log('Sonidos cargados:', allSounds);
    } catch (err) {
      console.error('Error al cargar sonidos:', err);
      setSounds([]);
    }
  };

  // Cargar al cargar el componente
  useEffect(() => {
    fetchSounds();
  }, []);

  return {
    loading,
    error,
    success,
    sounds,
    uploadSound,
    fetchSounds
  };
};

export default useSoundLibrary;
