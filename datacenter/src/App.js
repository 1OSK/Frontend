import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './assets/style.css';
import EquipmentListDatacenter from './pages/EquipmentListDatacenter';
import EquipmentDetailDatacenter from './pages/EquipmentDetailDatacenter';
import HomeDatacenter from './pages/HomeDatacenter';
const App = () => {
    // Регистрация Service Worker
    useEffect(() => {
        if ('serviceWorker' in navigator) {
            const registerServiceWorker = async () => {
                try {
                    const registration = await navigator.serviceWorker.register('./serviceWorker.js');
                    console.log('ServiceWorker зарегистрирован:', registration);
                }
                catch (error) {
                    console.error('Ошибка регистрации ServiceWorker:', error);
                }
            };
            window.addEventListener('load', registerServiceWorker);
            return () => {
                window.removeEventListener('load', registerServiceWorker);
            };
        }
    }, []);
    return (_jsx(Provider, { store: store, children: _jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(HomeDatacenter, {}) }), _jsx(Route, { path: "/datacenter-services", element: _jsx(EquipmentListDatacenter, {}) }), _jsx(Route, { path: "/datacenter-services/:id", element: _jsx(EquipmentDetailDatacenter, {}) })] }) }) }));
};
export default App;
