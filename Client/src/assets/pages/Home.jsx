import './styles/home.css';
import playBtn from '../images/home-images/play-boton.png';
import antena from '../images/home-images/antena.png';
import botonImg from '../images/home-images/botonera-img.png';
import radioImg from '../images/home-images/radio.png';

const Home = () => {
    // Datos dinámicos
    const emisoraEstadoDatos = [
        { titulo: 'Programas Activos:', valor: 5 },
        { titulo: 'Usuarios:', valor: 6 },
        { titulo: 'Sonidos Totales:', valor: 32 }
    ];

    return (
        <>
        <div className="contenido-home">
            <div className='contenedor-dashboard'>
                <div className='dashboard'>
                    <div className="titulos">
                        <div className="titulo">
                            <img src={antena} alt="Antena" />
                            <h2>Tus Programas</h2>
                        </div>
                        <h4>Acceso rápido para tus programas</h4>
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
                    <div className="celda-dashboard">
                        <h3>contenido</h3>
                    </div>
                </div>
                <div className='dashboard-botonera'>
                    <div className="titulo">
                        <img src={botonImg} alt="Botonera" />
                        <h2>Tu Botonera</h2>
                    </div>
                    <h4>Reproduce tus sonidos favoritos</h4>
                    <div className="botones">
                        <div className='boton'>
                            <div className="boton-input">
                                <img src={playBtn} alt="Play" />
                            </div>
                            <h5>Intro</h5>
                        </div>
                    </div>
                </div>
            </div>
            <div className="emisora-estado">
                <div className="titulo">
                    <img src={radioImg} alt="Radio" />
                    <h2>Estado de la emisora</h2>
                </div>
                <h4>Información general del estado de la emisora</h4>
                <div className="emisora-estado-contenido">
                    {emisoraEstadoDatos.map((dato, index) => (
                        <div className="emisora-estado-celda" key={index}>
                            <h3>{dato.titulo}</h3>
                            <h3>{dato.valor}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        </>
    );
};

export default Home;