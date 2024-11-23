import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import './App.css'; // Убедитесь, что путь правильный
import EquipmentListDatacenter from './pages/EquipmentListDatacenter';
import EquipmentDetailDatacenter from './pages/EquipmentDetailDatacenter';
import HomeDatacenter from './pages/HomeDatacenter';
import './assets/style.css'; // Убедитесь, что путь правильный
import './index.css'; // Убедитесь, что путь правильный

// Создание маршрутов для приложения
const router = createBrowserRouter([
  { path: '/', element: <HomeDatacenter /> },
  { path: '/datacenter-services', element: <EquipmentListDatacenter /> },
  { path: '/datacenter-services/:id', element: <EquipmentDetailDatacenter /> },
]);

function App() {

  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;