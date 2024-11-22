import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'; // Import BrowserRouter and Routes
import { Provider } from 'react-redux';
import store from './store';
import './App.css';
import EquipmentListDatacenter from './pages/EquipmentListDatacenter';
import EquipmentDetailDatacenter from './pages/EquipmentDetailDatacenter';
import HomeDatacenter from './pages/HomeDatacenter';
import './assets/style.css';
import './index.css';
function App() {
    useEffect(() => {
        // Проверка на существование Tauri API
        if (window.__TAURI__ && window.__TAURI__.tauri) {
            const { invoke } = window.__TAURI__.tauri;
            console.log('Tauri API доступен');
            // Вызов Tauri для выполнения команды 'create'
            invoke('tauri', { cmd: 'create' })
                .then((response) => {
                console.log('Tauri response:', response);
            })
                .catch((error) => {
                console.error('Ошибка вызова Tauri API:', error);
            });
            return () => {
                // Закрытие связи с Tauri при размонтировании
                invoke('tauri', { cmd: 'close' })
                    .then((response) => {
                    console.log('Tauri закрыт:', response);
                })
                    .catch((error) => {
                    console.error('Ошибка закрытия Tauri:', error);
                });
            };
        }
        else {
            console.warn('Tauri API недоступен.');
        }
    }, []);
    useEffect(() => {
        // Регистрируем сервис-воркер
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker
                    .register('./serviceWorker.js')
                    .then((registration) => {
                    console.log('ServiceWorker зарегистрирован', registration);
                })
                    .catch((error) => {
                    console.error('Ошибка регистрации сервис-воркера:', error);
                });
            });
        }
    }, []);
    return (_jsx(Provider, { store: store, children: _jsx(BrowserRouter, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomeDatacenter, {}) }), _jsx(Route, { path: "/datacenter-services", element: _jsx(EquipmentListDatacenter, {}) }), _jsx(Route, { path: "/datacenter-services/:id", element: _jsx(EquipmentDetailDatacenter, {}) })] }) }) }));
}
export default App;
