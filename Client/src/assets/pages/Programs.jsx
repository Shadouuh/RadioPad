import './styles/programs.css';
import { useState, useEffect } from 'react';
import ProgramModal from './../components/ProgramModal';
import usePrograms from './../../hooks/usePrograms';

const Programs = () => {
  const { programs, loading, error, createProgram, fetchPrograms } = usePrograms();
  const [showModal, setShowModal] = useState(false);
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
      soundEffects: { count: parseInt(formData.soundEffectsCount) || 0 }
    };

    const result = await createProgram(programData);
    if (result.success) {
      setShowModal(false);
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
                    Efectos de sonido: {program.soundEffects.length}
                  </h5>
                  <h5 className='texto-delga2'>
                    Operador: {program.operators}
                  </h5>
                  <h5 className='texto-delga2'>
                    Productor: {program.producers}
                  </h5>
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
        <ProgramModal title="Añadir Programa" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit} className="formulario-programas">
            <div className="form-div">
              <div className="grupo-form">
                <label htmlFor="name">Nombre del Programa</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grupo-form">
                <label htmlFor="image">URL de la Imagen</label>
                <input
                  type="text"
                  id="image"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grupo-form">
                <label htmlFor="operators">Operadores (separados por coma)</label>
                <input
                  type="text"
                  id="operators"
                  name="operators"
                  value={formData.operators}
                  onChange={handleInputChange}
                  required
                  />
                </div>

              <div className="grupo-form">
                <label htmlFor="producers">Productores (separados por coma)</label>
                <input
                  type="text"
                  id="producers"
                  name="producers"
                  value={formData.producers}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="form-div">
              <div className="grupo-form">
                <label htmlFor="time-init">Hora de Inicio</label>
                <input
                  type="time"
                  id="time-init"
                  name="time-init"
                  value={formData['time-init']}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grupo-form">
                <label htmlFor="time-final">Hora de Finalización</label>
                <input
                  type="time"
                  id="time-final"
                  name="time-final"
                  value={formData['time-final']}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="grupo-form-btn">
                <button type="submit" className='btn-guardar'>Guardar Programa</button>
                <button type="button" className='btn-cancelar' onClick={() => setShowModal(false)}>Cancelar</button>
              </div>
            </div>
          </form>
        </ProgramModal>
      )}
    </>
  );
};

export default Programs;