// src/components/Navbar.tsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../assets/style.css'; 

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false); 


  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <nav className="navigation-bar mb-0">
      <Link to="/" className="header-title">Data Center</Link>
      
      <div className={`burger-menu ${menuActive ? 'active' : ''}`} onClick={toggleMenu}>
        <div className="burger-line"></div>
        <div className="burger-line"></div>
        <div className="burger-line"></div>
      </div>
      

      <div className={`nav-links ${menuActive ? 'active' : ''}`}>
        <Link to="/datacenter-services/" className="nav-link">Список товаров</Link>
      </div>
    </nav>
  );
};

export default Navbar;