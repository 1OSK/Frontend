import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './App.css';
import EquipmentListDatacenter from './pages/EquipmentListDatacenter';
import EquipmentDetailDatacenter from './pages/EquipmentDetailDatacenter';
import HomeDatacenter from './pages/HomeDatacenter';
import './assets/style.css'; // Убедитесь, что путь правильный
import './index.css'; // Убедитесь, что путь правильный

function App() {
  useEffect(() => {
    // Проверка на существование Tauri API
    if (window.__TAURI__ && window.__TAURI__.tauri) {
      const { invoke } = window.__TAURI__.tauri;

      // Вызов Tauri для выполнения команды 'create'
      invoke('tauri', { cmd: 'create' })
        .then((response: any) => console.log(response))
        .catch((error: any) => console.log(error));

      return () => {
        // Закрытие связи с Tauri при размонтировании
        invoke('tauri', { cmd: 'close' })
          .then((response: any) => console.log(response))
          .catch((error: any) => console.log(error));
      };
    }
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('./serviceWorker.js')
          .then((registration) => {
            console.log('ServiceWorker зарегистрирован', registration);
          })
          .catch((error) => {
            console.log('Ошибка регистрации сервис-воркера:', error);
          });
      });
    }
  }, []); // useEffect должен быть внутри компонента

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/" element={<HomeDatacenter />} />
          <Route path="/datacenter-services" element={<EquipmentListDatacenter />} />
          <Route path="/datacenter-services/:id" element={<EquipmentDetailDatacenter />} />
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;