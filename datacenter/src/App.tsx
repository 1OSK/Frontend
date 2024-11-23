import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';

import './assets/style.css'; 
import EquipmentListDatacenter from './pages/EquipmentListDatacenter';
import EquipmentDetailDatacenter from './pages/EquipmentDetailDatacenter';
import HomeDatacenter from './pages/HomeDatacenter';

const App: React.FC = () => {
  // Регистрация Service Worker
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      const registerServiceWorker = async () => {
        try {
          const registration = await navigator.serviceWorker.register('./serviceWorker.js');
          console.log('ServiceWorker зарегистрирован:', registration);
        } catch (error) {
          console.error('Ошибка регистрации ServiceWorker:', error);
        }
      };

      window.addEventListener('load', registerServiceWorker);

      return () => {
        window.removeEventListener('load', registerServiceWorker);
      };
    }
  }, []);

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
};

export default App;