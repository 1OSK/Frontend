import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import EquipmentListDatacenter from './pages/EquipmentListDatacenter';
import EquipmentDetailDatacenter from './pages/EquipmentDetailDatacenter';

// Создаем маршрутизатор
const router = createBrowserRouter([
  {
    path: '/',
    element: <EquipmentListDatacenter isAuthenticated={false} currentOrderId={null} />,
  },
  {
    path: '/datacenter-services/:id',  // Динамический маршрут для деталей оборудования
    element: <EquipmentDetailDatacenter />,
  },
]);

// Рендерим приложение
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);