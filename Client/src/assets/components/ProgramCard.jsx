import './styles/programCard.css';
const ProgramCard = (nombre, imagen) => {
    return (
        <div>
            <img src={imagen}/>
            <h1>{nombre}</h1>
        </div>
    );
}
export default ProgramCard;