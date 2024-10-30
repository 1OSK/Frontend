import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import EquipmentListDatacenter from './pages/EquipmentListDatacenter';
import EquipmentDetailDatacenter from './pages/EquipmentDetailDatacenter';

const router = createBrowserRouter([
  {
    path: '/',
    element: <EquipmentListDatacenter />,
  },
  {
    path: '/datacenter-services/:id',  // Define dynamic route for equipment detail
    element: <EquipmentDetailDatacenter />,
  },

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);