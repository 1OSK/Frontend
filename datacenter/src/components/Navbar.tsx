import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../assets/style.css';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../slices/authSlice';
import { RootState } from '../store';
import { Api } from '../api/Api'; // Импорт API для выхода
import { RequestParams } from '../api/Api'; // Импорт RequestParams

const Navbar = () => {
  const [menuActive, setMenuActive] = useState(false);

  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated); // Проверяем аутентификацию
  const username = useSelector((state: RootState) => state.auth.user?.username); // Получаем имя пользователя
  const sessionId = useSelector((state: RootState) => state.auth.sessionId); // Получаем sessionId
  const dispatch = useDispatch();
  const api = new Api();

  // Обработчик открытия/закрытия меню
  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  // Обработчик выхода из системы
  const handleLogout = async () => {
    if (!sessionId) {
      alert("Не найден session_id. Пожалуйста, войдите снова.");
      return;
    }

    try {
      // Запрос на выход из системы с передачей session_id в теле запроса
      const response = await api.users.usersLogoutCreate({
        // Передаем session_id как часть тела запроса
        body: { sessionid: sessionId }, // sessionid должен быть в теле запроса
      } as RequestParams); // Явно приводим тип к RequestParams

      // Проверка успешного ответа
      if (response && response.status === 200) {
        dispatch(logout()); // Обновляем Redux-состояние
        console.log("Выход выполнен успешно");
      } else {
        throw new Error("Ошибка при выходе: неверный ответ от сервера");
      }
    } catch (err) {
      console.error("Ошибка при выходе:", err);
      alert("Ошибка при выходе. Попробуйте позже.");
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
        {/* Список услуг доступен всегда */}
        <Link to="/datacenter-services/" className="nav-link">Список товаров</Link>

        {!isAuthenticated ? (
          // Если пользователь не вошел, показываем кнопки "Вход" и "Регистрация"
          <>
            <Link to="/login" className="nav-link">Вход</Link>
            <Link to="/register" className="nav-link">Регистрация</Link>
          </>
        ) : (
          // Если пользователь вошел, показываем его логин и кнопку "Выйти"
          <>
            <span className="nav-link username">{username}</span>
            <button onClick={handleLogout} className="nav-link logout-btn">
              Выйти
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;