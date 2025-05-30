import './styles/programs.css';
import { useState, useEffect } from 'react';
import { LuTrash2, LuPencil } from "react-icons/lu";
import ProgramModal from './../components/ProgramModal';
import usePrograms from './../../hooks/usePrograms';

const Programs = () => {
  const { programs, loading, error, createProgram, fetchPrograms, updateProgram, deleteProgram } = usePrograms();
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editing, setEditing] = useState(false);
  const [programId, setProgramId] = useState(null);
  const [programToDelete, setProgramToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    image: '',
    operators: [],
    producers: [],
    soundEffects: [],
    'time-init': '',
    'time-final': ''
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const programData = {
      ...formData,
      operators: formData.operators.split(',').map(op => op.trim()),
      producers: formData.producers.split(',').map(prod => prod.trim()),
      // soundEffects: { count: parseInt(formData.soundEffectsCount) || 0 }
    };

    const result = await createProgram(programData);
    if (result.success) {
      setShowModal(false);
    }
    setFormData({
      name: '',
      image: '',
      operators: [],
      producers: [],
      soundEffects: [],
      'time-init': '',
      'time-final': ''
    });
  };

  const openEditModal = (programId) => {
    setFormData({
      name: '',
      image: '',
      operators: [],
      producers: [],
      soundEffects: [],
      'time-init': '',
      'time-final': ''
    });
    if (programId) {
      const programToEdit = programs.find(program => program.id === programId);
      setFormData({
        name: programToEdit.name || '',
        image: programToEdit.image || '',
        operators: Array.isArray(programToEdit.operators) ? programToEdit.operators.join(', ') : programToEdit.operators || '',
        producers: Array.isArray(programToEdit.producers) ? programToEdit.producers.join(', ') : programToEdit.producers || '',
        soundEffects: programToEdit.soundEffects || [],
        'time-init': programToEdit['time-init'] || '',
        'time-final': programToEdit['time-final'] || '',
        soundEffectsCount: programToEdit.soundEffects && programToEdit.soundEffects.count ? programToEdit.soundEffects.count : 0
      });
    } else {
      setEditing(false);
    }
    setShowModal(true);
    setProgramId(programId);
  }

  const editProgram = async (e) => {
    e.preventDefault();
    try {
      const programData = {
        ...formData,
        operators: formData.operators.split(',').map(op => op.trim()),
        producers: formData.producers.split(',').map(prod => prod.trim()),
      };

      const result = await updateProgram(programId, programData);
      if (result.success) {
        setShowModal(false);
        setEditing(false);
        setProgramId(null);
        setFormData({
          name: '',
          image: '',
          operators: [],
          producers: [],
          soundEffects: [],
          'time-init': '',
          'time-final': ''
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  const openDeleteModal = (program) => {
    setProgramToDelete(program);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    try {
      const result = await deleteProgram(programToDelete.id);
      if (result.success) {
        setShowDeleteModal(false);
        setProgramToDelete(null);
        // Refresh the programs list
        await fetchPrograms();
      }
    } catch (err) {
      console.error('Error deleting program:', err);
    }
  };

  return (
    <>
      <div className='contenido-programas'>
        {loading ? (
          <p>Cargando programas...</p>
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          <>
            {programs.map(program => (
              <div className='card-programa' key={program.id}>
                <img
                  src={program.image}
                  alt={program.name}
                  className='profile-img'
                />
                <h3>{program.name}</h3>
                <h6 className='texto-delgado'>
                  {program['time-init']} - {program['time-final']}
                </h6>
                <div className='linea'></div>
                <div className='card-div'>
                  <h5 className='texto-cantidad'>
                    Efectos de sonido: {program.soundEffects.length || 0}
                  </h5>
                  
                  <div className="btn-acciones">
                    <button className='btn' onClick={() => openEditModal(program.id)}><LuPencil size={20} /></button>
                    <button className='btn' onClick={() => openDeleteModal(program)}><LuTrash2 size={20} /></button>
                  </div>
                </div>
              </div>
            ))}

            <div className="card-añadir" onClick={() => setShowModal(true)}>
              <h4 className='mas'>+</h4>
              <h4>Añadir Programa</h4>
            </div>
          </>
        )}
      </div>

      {showModal && (
        <ProgramModal 
          title={editing ? "Editar Programa" : "Añadir Programa"} 
          onClose={() => {
            setShowModal(false);
            setEditing(false);
            setProgramId(null);
            setFormData({
              name: '',
              image: '',
              operators: [],
              producers: [],
              soundEffects: [],
              'time-init': '',
              'time-final': ''
            });
          }}
          editing={editing}
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          editProgram={editProgram}
        />
      )}

      {showDeleteModal && (
        <ProgramModal title="Eliminar Programa" onClose={() => {
          setShowDeleteModal(false);
          setProgramToDelete(null);
        }}>
          <div className="delete-confirmation">
            <p>¿Estás seguro que deseas eliminar el programa "{programToDelete.name}"?</p>
            <p>Esta acción no se puede deshacer.</p>

            <div className="grupo-form-btn">
              <button type="button" className='btn btn-delete' onClick={handleDelete}>
                Eliminar Programa
              </button>
              <button type="button" className='btn btn-cancelar' onClick={() => {
                setShowDeleteModal(false);
                setProgramToDelete(null);
              }}>
                Cancelar
              </button>
            </div>
          </div>
        </ProgramModal>
      )}
    </>
  );
};

export default Programs;