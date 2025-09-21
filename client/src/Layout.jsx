// Componentes
import Nav from './components/Nav/Nav.jsx';
import Footer from './components/Footer/Footer.jsx';

// Dependencias
import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from 'react';

const Layout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <>
      <header>
        <Nav />
      </header>
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;