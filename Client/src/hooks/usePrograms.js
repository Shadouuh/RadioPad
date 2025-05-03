import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { collection, doc, setDoc, getDocs, updateDoc, deleteDoc, getDoc } from 'firebase/firestore';

const usePrograms = () => {
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Función para obtener todos los programas desde Firestore
    const fetchPrograms = async () => {
        setLoading(true);
        setError('');
        try {
            const programsSnapshot = await getDocs(collection(db, 'programs'));

            if (programsSnapshot.empty) {
                console.log('No hay programas en la base de datos');
                setPrograms([]);
                return [];
            }

            const programsList = programsSnapshot.docs.map(doc => ({
                id: doc.id,
                name: doc.data().name || 'Sin nombre',
                image: doc.data().image || null,
                operators: doc.data().operators || [],
                producers: doc.data().producers || [],
                soundEffects: doc.data().soundEffects || [],
                'time-final': doc.data()['time-final'] || '',
                'time-init': doc.data()['time-init'] || ''
            }));

            console.log('Programas cargados:', programsList);
            setPrograms(programsList);
            return programsList;
        } catch (error) {
            setError('Error al obtener programas: ' + error.message);
            console.error('Error al obtener programas:', error);
            return [];
        } finally {
            setLoading(false);
        }
    };

    // Cargar programas al inicializar el hook
    useEffect(() => {
        fetchPrograms();
    }, []);

    // Función para crear un nuevo programa
    const createProgram = async (formData) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        // Validar que todos los campos estén completos
        if (!formData.name || !formData.image || !formData.operators || !formData.producers || !formData.soundEffects || !formData['time-final'] || !formData['time-init']) {
            setError('Por favor, complete todos los campos');
            setLoading(false);
            return { success: false };
        }

        try {
            // Generar un ID único para el programa
            const programDocRef = doc(collection(db, 'programs'));

            // Preparar el objeto de programa
            const programData = {
                name: formData.name,
                image: formData.image,
                operators: formData.operators || [],
                producers: formData.producers || [],
                soundEffects: formData.soundEffects || [],
                'time-final': formData['time-final'] || '',
                'time-init': formData['time-init'] || ''
            };

            // Guardar información del programa directamente en Firestore
            await setDoc(programDocRef, programData);

            console.log('Programa guardado en Firestore correctamente');

            // Después de crear el programa, actualizar la lista de programas
            await fetchPrograms();

            setSuccessMessage(`Programa "${formData.name}" creado exitosamente`);

            setLoading(false);
            return { success: true, message: successMessage };
        } catch (error) {
            console.error('Error al guardar programa en Firestore:', error);
            setError('Error al guardar datos del programa en la base de datos: ' + error.message);
            setLoading(false);
            return { success: false, error: error.message };
        }
    };

    // Función para actualizar un programa existente
    const updateProgram = async (programId, formData) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        // Validar que el nombre esté completo
        if (!formData.name || !formData.image || !formData.operators || !formData.producers || !formData.soundEffects || !formData['time-final'] || !formData['time-init']) {
            setError('Por favor, completa al menos el nombre del programa');
            setLoading(false);
            return { success: false };
        }

        try {
            const programDocRef = doc(db, 'programs', programId);

            // Obtener datos actuales del programa para mantener campos que no se modifican
            const programDoc = await getDoc(programDocRef);
            if (!programDoc.exists()) {
                throw new Error('El programa no existe');
            }

            // Preparar datos para actualizar
            const updateData = {
                name: formData.name || '',
                operators: formData.operators || [],
                producers: formData.producers || [],
                soundEffects: formData.soundEffects || [],
                'time-final': formData['time-final'] || '',
                'time-init': formData['time-init'] || ''
            };

            // Si hay una nueva imagen, actualizarla
            if (formData.image) {
                updateData.image = formData.image;
            }

            // Actualizar información del programa en Firestore
            await updateDoc(programDocRef, updateData);

            console.log('Programa actualizado en Firestore correctamente');

            // Después de actualizar el programa, actualizar la lista de programas
            await fetchPrograms();

            setSuccessMessage(`Programa "${formData.name}" actualizado exitosamente`);

            setLoading(false);
            return { success: true, message: successMessage };
        } catch (error) {
            console.error('Error al actualizar programa en Firestore:', error);
            setError('Error al actualizar datos del programa en la base de datos: ' + error.message);
            setLoading(false);
            return { success: false, error: error.message };
        }
    };

    // Función para eliminar un programa
    const deleteProgram = async (programId) => {
        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const programDocRef = doc(db, 'programs', programId);

            // Eliminar el documento del programa
            await deleteDoc(programDocRef);

            console.log('Programa eliminado de Firestore correctamente');

            // Actualizar la lista de programas después de eliminar
            await fetchPrograms();

            setSuccessMessage('Programa eliminado exitosamente');

            setLoading(false);
            return { success: true, message: successMessage };
        } catch (error) {
            console.error('Error al eliminar programa de Firestore:', error);
            setError('Error al eliminar programa de la base de datos: ' + error.message);
            setLoading(false);
            return { success: false, error: error.message };
        }
    };

    // Función para obtener un programa específico por ID
    const getProgramById = async (programId) => {
        try {
            const programDocRef = doc(db, 'programs', programId);
            const programDoc = await getDoc(programDocRef);

            if (!programDoc.exists()) {
                setError('Programa no encontrado');
                return null;
            }

            const programData = programDoc.data();
            return {
                id: programDoc.id,
                name: programData.name || '',
                image: programData.image || null,
                operators: programData.operators || [],
                producers: programData.producers || [],
                soundEffects: programData.soundEffects || [],
                'time-final': programData['time-final'] || '',
                'time-init': programData['time-init'] || ''
            };
        } catch (error) {
            console.error('Error al obtener programa por ID:', error);
            setError('Error al obtener datos del programa: ' + error.message);
            return null;
        }
    };

    return {
        programs,
        loading,
        error,
        successMessage,
        createProgram,
        updateProgram,
        deleteProgram,
        getProgramById,
        fetchPrograms,
        setError,
        setSuccessMessage
    };
};

export default usePrograms;