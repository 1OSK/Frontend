import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../assets/style.css';
import { Api } from '../api/Api';  // Импортируем ваш API для выхода

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // Состояние для отслеживания, был ли нажата кнопка "Вход"

  // Создаем экземпляр API
  const api = new Api();

  // Обработчик открытия/закрытия меню
  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  // Обработчик выхода из системы
  const handleLogout = async () => {
    try {
      await api.users.usersLogoutCreate();  // Вызываем метод выхода из системы
      setIsLoggedIn(false);  // Сбрасываем состояние "вошел" на false
      console.log("Выход выполнен успешно");
    } catch (err) {
      console.error("Ошибка при выходе:", err);
    }
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

        {/* Показываем кнопку "Вход" и "Регистрация" если не нажата кнопка "Вход" */}
        {!isLoggedIn ? (
          <>
            <Link to="/login" className="nav-link" onClick={() => setIsLoggedIn(true)}>Вход</Link>
            <Link to="/register" className="nav-link">Регистрация</Link>
          </>
        ) : (
          // Показываем кнопку "Выйти", если пользователь "вошел"
          <button onClick={handleLogout} className="nav-link logout-btn">
            Выйти
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;