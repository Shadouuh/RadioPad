import './styles/programs.css';
import imagen from '../images/profile-pics/wild.png';

const Programs = () => {
  return (
    <>
    <div className='contenido-programas'>
      <div className='card-programa'>
        <img src={imagen} alt="imagen" className='profile-img'/>
        <h3>The Wild Project</h3>
        <h6 className='texto-delgado'>8:00PM - 10:00 PM</h6>
        <div className='linea'></div>
        <div className='card-div'>
          <h5 className='texto-cantidad'>FX Disponibles: 12</h5>
          <h5 className='texto-delgado'>Operador: Micho Tito</h5>
        </div>
      </div>

      <div className="card-añadir">
        <h4 className='mas'>+</h4>
        <h4>Añadir Programa</h4>
      </div>

    </div>
    </>
  );
};

export default Programs;