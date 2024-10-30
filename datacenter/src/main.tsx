import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import EquipmentListDatacenter from './pages/EquipmentListDatacenter';

const router = createBrowserRouter([
  {
    path: '/',
    element: <EquipmentListDatacenter />,
  },

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);