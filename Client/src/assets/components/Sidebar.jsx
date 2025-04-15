import { Link, useLocation } from "react-router-dom";
import { LuRadio, LuAudioWaveform, LuUsers, LuSettings, LuMusic, LuRadioTower } from "react-icons/lu";
import { useState, useEffect } from "react";
import profilePf from '../images/profile-pics/1.png';
// Estilos
import './styles/Sidebar.css';

const Sidebar = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const location = useLocation();
    
    const menuItems = [
        {
            path: "/",
            name: "Dashboard",
            icon: <LuRadio size={16} />,
        },
        {
            path: "/programs",
            name: "Programas",
            icon: <LuRadioTower size={16} />,
        },
        {
            path: "/pads",
            name: "Botonera",
            icon: <LuAudioWaveform size={16} />,
        },
        {
            path: "/library",
            name: "Librería de Sonidos",
            icon: <LuMusic size={16} />,
        },
        {
            path: "/company-pad",
            name: "Botonera Emisora",
            icon: <LuRadio size={16} />,
        },
        {
            path: "/users",
            name: "Usuarios",
            icon: <LuUsers size={16} />,
        },
        {
            path: "/configuration",
            name: "Configuración",
            icon: <LuSettings size={16} />,
        }
    ];
    useEffect(() => {
        const currentPath = location.pathname;
        const index = menuItems.findIndex(item => item.path === currentPath);
        if (index !== -1) {
            setActiveIndex(index);
        }
    }, [location.pathname]);

    const handleActive = (index) => {
        setActiveIndex(index);
    };

    return (
        <section className="sidebar">
            <header>
                <div className="header-logo">
                <LuAudioWaveform size={18} />
                </div>
                <div className="header-title">
                <h1>RadioPad</h1>
                <h4>Sound Manager</h4>
                </div>
                
            </header>
            <div className="sidebar-menu">
                <ul>
                    {menuItems.map((item, index) => (
                        <Link 
                            to={item.path} 
                            className={activeIndex === index ? "active" : ""} 
                            key={index}
                            onClick={() => handleActive(index)}
                        >
                            {item.icon}
                            <p>{item.name}</p>
                        </Link>
                    ))}
                </ul>
            </div>
            <footer>
                
                <img src={profilePf} alt="Foto de Perfil" />
                
                <p className="foot-text">Thiago Gonzalez</p>
            </footer>
        </section>
    );
}

export default Sidebar;