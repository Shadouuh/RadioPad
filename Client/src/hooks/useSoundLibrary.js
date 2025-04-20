import { useState, useEffect } from 'react';
import { uploadAudioToCloudinary } from '../api/cloudinaryService';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const useSoundLibrary = () => {
    //Manejos de estado
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [sounds, setSounds] = useState([]);
  
  //Se conecta a fire
  const db = getFirestore();
  const auth = getAuth();

  // Subrir los temazos a claudio
  const uploadSound = async (file, name, category) => {
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

      //lo que se guarda en la coleccion
      const soundData = {
        name,
        category,
        sound: url,
        createdAt: new Date(),//Fecha de creacion por si pinta
        userId: auth.currentUser ? auth.currentUser.uid : null,//Esto es por si despues queremos asociar los sonidos a un usuario especifico, aunque no se si va aca :v
      };

      // Guardar en Firebase
      await addDoc(collection(db, 'soundLibrary'), soundData);

      setSuccess(true);
      // Después de subir, actualizamos la lista
      await fetchSounds();
    } catch (err) {
      setError(err.message || 'Hubo un problema al subir el sonido.');
    } finally {
      setLoading(false);
    }
  };

  // Ontener los Efects
  const fetchSounds = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'soundLibrary'));
      const soundList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSounds(soundList);
    } catch (err) {
      console.error('Error al cargar sonidos:', err);
    }
  };

  // Cargar al cargar el componente
  useEffect(() => {
    fetchSounds();
  }, []);

  return {
    uploadSound,
    loading,
    error,
    success,
    sounds,        
    fetchSounds    
  };
};

export default useSoundLibrary;
