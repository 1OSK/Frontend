import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './App.css';
import EquipmentListDatacenter from './pages/EquipmentListDatacenter';
import EquipmentDetailDatacenter from './pages/EquipmentDetailDatacenter';
import HomeDatacenter from './pages/HomeDatacenter';
import './assets/style.css'; // Убедитесь, что путь правильный
import './index.css'; // Убедитесь, что путь правильный
import { invoke } from "@tauri-apps/api/core";

// Проверка, чтобы использовать правильный basename для GitHub Pages
const isGitHubPages = window.location.hostname === '1osk.github.io';
const basename = isGitHubPages ? '/Frontend' : ''; // Использование правильного basename для GitHub Pages

// Создание маршрутов для приложения
const router = createBrowserRouter(
  [
    { path: '/', element: <HomeDatacenter /> },
    { path: '/datacenter-services', element: <EquipmentListDatacenter /> },
    { path: '/datacenter-services/:id', element: <EquipmentDetailDatacenter /> },
  ],
  { basename }
);

function App() {
  useEffect(()=>{
    invoke('tauri', {cmd:'create'})
      .then(() =>{console.log("Tauri launched")})
      .catch(() =>{console.log("Tauri not launched")})
    return () =>{
      invoke('tauri', {cmd:'close'})
        .then(() =>{console.log("Tauri launched")})
        .catch(() =>{console.log("Tauri not launched")})
    }
  }, [])

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
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;