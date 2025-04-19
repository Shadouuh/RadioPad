import './styles/home.css';
import playBtn from '../images/home-images/play-boton.png';
import antena from '../images/home-images/antena.png';
import botonImg from '../images/home-images/botonera-img.png';
const Home = () => {
    return (
        <>
        <div className="contenido-home">
            <div className='contenedor-dashboard'>
                <div className='dashboard'>
                    <div className="titulos">
                        <div className="titulo">
                            <img src={antena}/>
                            <h2>Tus Programas</h2>
                        </div>
                        <h4>Acceso rapido para tus programas</h4>
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
                    <img src={botonImg}/>
                    <h2>Tu Botonera</h2>
                    </div>
                    <h4>reproduce tus sonidos favoritos</h4>
                    <div className="botones">
                    <div className='boton'>
                        <div className="boton-input">
                            <img src={playBtn}/>
                        </div>
                        <h5>Intro</h5>
                    </div>                 
                    <div className="boton-añadir">
                        <div className="boton-input-añadir">
                            <h3>+</h3>
                        </div>
                        <h4>Añadir Boton</h4>
                    </div>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}
export default Home;