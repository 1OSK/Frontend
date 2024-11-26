// src/pages/Register.tsx

import React, { useState } from 'react';
import { Api } from '../api/Api'; // Импортируем сгенерированный API
import { AxiosResponse } from 'axios'; // Для уточнения типа ответа от сервера
import Navbar from "../components/Navbar";
const Register = () => {
  // Состояния для хранения значений формы
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<string>('');

  // Создаем экземпляр класса Api
  const api = new Api();

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Отправляем данные для регистрации
      const response: AxiosResponse<{ email?: string }> = await api.users.usersCreate({
        email,
        password,
      });

      if (response.data?.email) {
        setSuccess('Регистрация прошла успешно! Теперь вы можете войти.');
      } else {
        setError('Не удалось зарегистрировать пользователя. Попробуйте позже.');
      }
    } catch (err) {
      setError('Ошибка при регистрации. Попробуйте позже.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {/* Navbar теперь в самом верху */}
    <Navbar />

    <div className="register-container">
      <h2>Регистрация</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Пароль</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword">Подтвердите пароль</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Загрузка...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
    </>
  );
};

export default Register;