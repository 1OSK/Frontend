// src/components/Navbar.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Главная</Link></li>
        <li><Link to="/equipment">Список оборудования</Link></li>
        <li><Link to="/order/1">Детали заказа</Link></li> {/* Пример ссылки на детали заказа */}
      </ul>
    </nav>
  );
};

export default Navbar;