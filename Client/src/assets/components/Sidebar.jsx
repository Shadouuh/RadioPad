import { Link, useLocation } from "react-router-dom";
import { LuRadio, LuAudioWaveform, LuUsers, LuSettings, LuMusic, LuRadioTower, LuUser } from "react-icons/lu";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/config";
import { doc, getDoc } from "firebase/firestore";
// Estilos
import './styles/Sidebar.css';

const Sidebar = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [profilePicture, setProfilePicture] = useState(null);
    const [userName, setUserName] = useState('');
    const location = useLocation();
    const { currentUser } = useAuth();
    
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
    
    // Cargar la foto de perfil y nombre del usuario
    useEffect(() => {
        const fetchUserData = async () => {
            if (currentUser) {
                // Establecer el nombre de usuario
                if (currentUser.displayName) {
                    setUserName(currentUser.displayName);
                } else if (currentUser.email) {
                    const emailUsername = currentUser.email.split('@')[0];
                    setUserName(emailUsername);
                }
                
                // Verificar si hay una foto de perfil en el objeto de usuario
                if (currentUser.photoURL) {
                    setProfilePicture(currentUser.photoURL);
                } else {
                    // Intentar obtener la foto de perfil desde Firestore
                    try {
                        const userDocRef = doc(db, 'users', currentUser.uid);
                        const userDoc = await getDoc(userDocRef);
                        
                        if (userDoc.exists() && userDoc.data().profilePicture?.url) {
                            setProfilePicture(userDoc.data().profilePicture.url);
                        } else if (userDoc.exists() && userDoc.data().avatarColor) {
                            // Si no hay foto pero hay un color de avatar, usar null para mostrar las iniciales
                            setProfilePicture(null);
                        }
                    } catch (error) {
                        console.error('Error al obtener datos del usuario:', error);
                    }
                }
            }
        };
        
        fetchUserData();
    }, [currentUser]);

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
                {profilePicture ? (
                    <img src={profilePicture} alt="Foto de Perfil" />
                ) : (
                    <div className="avatar-placeholder">
                        {userName ? userName.substring(0, 2).toUpperCase() : <LuUser />}
                    </div>
                )}
                <p className="foot-text">{userName || 'Usuario'}</p>
            </footer>
        </section>
    );
}

export default Sidebar;