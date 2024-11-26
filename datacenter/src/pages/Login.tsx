import React, { useState } from "react";
import { Api } from "../api/Api"; // Импортируем сгенерированный API
import { AxiosResponse } from "axios"; // Импортируем AxiosResponse для уточнения типа ответа
import Navbar from "../components/Navbar";
const Login = () => {
  // Состояния для хранения значений формы
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Создаем экземпляр класса Api
  const api = new Api();

  // Обработчик отправки формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // Отправляем данные для аутентификации и уточняем тип ответа
      const response: AxiosResponse<{ session_id?: string }> = await api.users.usersLoginCreate({
        email,
        password,
      });

      // Проверяем, пришел ли session_id
      if (response.data?.session_id) {
        // Сохраняем session_id в localStorage
        localStorage.setItem("session_id", response.data.session_id);
        console.log("Успешный вход! Session ID:", response.data.session_id);

        // Можно перенаправить пользователя на главную страницу или другую страницу
        // Например:
        // history.push("/dashboard");
      } else {
        setError("Не удалось войти. Проверьте данные и попробуйте снова.");
      }
    } catch (err) {
      setError("Ошибка при аутентификации. Попробуйте позже.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    {/* Navbar теперь в самом верху */}
    <Navbar />
    
    <div className="login-container">
      <h2>Вход в систему</h2>
      <form onSubmit={handleSubmit}>
        {error && <p style={{ color: "red" }}>{error}</p>}

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

        <button type="submit" disabled={loading}>
          {loading ? "Загрузка..." : "Войти"}
        </button>
      </form>
    </div>
    </>
  );
};

export default Login;