import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { updateUserInfo } from '../slices/authSlice';
import { Api, User } from '../api/Api';
import { RequestParams } from '../api/Api';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';

const Profile: React.FC = () => {
  const username = useSelector((state: RootState) => state.auth.user?.username);
  const email = useSelector((state: RootState) => state.auth.user?.email);
  const sessionId = useSelector((state: RootState) => state.auth.sessionId);

  const dispatch = useDispatch();
  const api = new Api();

  const [newEmail, setNewEmail] = useState<string>(email || '');
  const [newPassword, setNewPassword] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);


  
  // Обработчик обновления данных пользователя
  const handleUpdateUser = async () => {
    try {
        if (!sessionId) {
            alert("Не найден session_id. Пожалуйста, войдите снова.");
            return;
          }
          // Устанавливаем session_id в куки (без HttpOnly)
      document.cookie = `sessionid=${sessionId}; path=/; SameSite=Strict`;
  
      const userData: User = {
        email: newEmail,
        password: newPassword || '',  // Если пароль не меняется, передаем пустую строку
      };
  
      // Выполняем запрос на обновление данных пользователя
      const response = await api.users.usersUpdateUpdate(userData, {
        withCredentials: true,  // Передаем куки с запросом
      } as RequestParams);
  
      if (response.status === 200) {
        // Если запрос успешен, обновляем email в Redux
        dispatch(updateUserInfo({ email: newEmail }));
        alert('Данные успешно обновлены!');
      } else {
        // Если ошибка на сервере, выводим сообщение
        throw new Error('Ошибка при обновлении данных.');
      }
    } catch (err) {
      // В случае ошибки, выводим сообщение об ошибке
      setErrorMessage('Ошибка при обновлении данных. Попробуйте позже.');
      console.error(err);
    }
  };

  return (
    <>
      <Navbar />
      <Breadcrumb
        items={[
          { label: "Главная", path: "/" },
          { label: "Личный кабинет", path: "/profile" }
        ]}
      />
      <div className="register-container">
        <h2>Личный кабинет</h2>
        <p>Добро пожаловать, {username || 'гость'}!</p>

        <div className="update-form">
          {errorMessage && <p className="error-message">{errorMessage}</p>}

          <form onSubmit={(e) => { e.preventDefault(); handleUpdateUser(); }}>
            <div className="input-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="input-field"
                placeholder="Введите новый email"
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="input-field"
                placeholder="Введите новый пароль (если нужно)"
              />
            </div>

            <button type="submit" className="submit-btn">
              Обновить данные
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Profile;