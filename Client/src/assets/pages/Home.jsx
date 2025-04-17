import './styles/home.css';

const Home = () => {
    return (
        <>
        <div className="contenido-home">
                <h1>Bienvenido wanchope</h1>
                <div className='contenedor-dashboard'>
                <div className='dashboard'>
                    <div className="celda-dashboard">
                        <h3>contenido</h3>
                    </div>
                    <div className="celda-dashboard">
                        <h3>contenido</h3>
                    </div>
                    <div className="celda-dashboard">
                        <h3>contenido</h3>
                    </div>
                    <div className="celda-dashboard">
                        <h3>contenido</h3>
                    </div>
                </div>
                <div className='dashboard-botonera'>
                    <h3>Tu Botonera</h3>
                    <div className="botones">
                    <div className='boton'>
                        <div className="boton-input"></div>
                        <h6>Intro</h6>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
export default Home;