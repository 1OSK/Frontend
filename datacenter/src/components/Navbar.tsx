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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Получаем draftOrderId из Redux
  const draftOrderId = useSelector((state: RootState) => state.ourData.draftOrderId);
  
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated); // Проверяем аутентификацию
  const username = useSelector((state: RootState) => state.auth.user?.username); // Получаем имя пользователя
  const sessionId = useSelector((state: RootState) => state.auth.sessionId); // Получаем sessionId
  const dispatch = useDispatch();
  const api = new Api();

  // Удаляем sessionId из куки
  const deleteSessionCookie = () => {
    document.cookie = `sessionid=${sessionId}; path=/; SameSite=Strict; Secure; HttpOnly`;
  };

  // Обработчик открытия/закрытия меню
  const toggleMenu = () => {
    setMenuActive(!menuActive);
  };

  const handleLogout = async () => {
    try {
      if (!sessionId) {
        alert("Не найден session_id. Пожалуйста, войдите снова.");
        return;
      }
  
      // Устанавливаем session_id в куки (без HttpOnly)
      document.cookie = `sessionid=${sessionId}; path=/; SameSite=Strict`;
  
      // Запрос на выход из системы
      const response = await api.users.usersLogoutCreate({
        withCredentials: true, // Передаем куки с запросом
      } as RequestParams);
  
      if (response && response.status === 200) {
        // Удаляем куки после успешного выхода
        deleteSessionCookie();
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
        <Link to="/datacenter-services/" className="nav-link">Список товаров</Link>
        
        {/* Ссылка "Мои Заказы" доступна только для авторизованных пользователей */}
        {isAuthenticated &&  (
          <Link to={`/datacenter-orders/${draftOrderId}?fromBurger=true`} className="nav-link">Мои Заказы</Link>
        )}

        {!isAuthenticated ? (
          <>
            <Link to="/login" className="nav-link">Вход</Link>
            <Link to="/register" className="nav-link">Регистрация</Link>
          </>
        ) : (
          <>
            <span className="nav-link username">{username}</span>
            <button onClick={handleLogout} className="nav-link logout-btn">
              Выйти
            </button>
          </>
        )}
      </div>

      {errorMessage && <div className="error-message">{errorMessage}</div>}
    </nav>
  );
};

export default Navbar;