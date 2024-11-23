import React from 'react';
import ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

import './index.css';
import EquipmentListDatacenter from './pages/EquipmentListDatacenter';
import EquipmentDetailDatacenter from './pages/EquipmentDetailDatacenter';
import HomeDatacenter from './pages/HomeDatacenter';
import { Provider } from 'react-redux'; 
import store from './store';  

const isGitHubPages = window.location.hostname === '1osk.github.io'; 



const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <HomeDatacenter />,
    },
    {
      path: '/datacenter-services',
      element: <EquipmentListDatacenter />,
    },
    {
      path: '/datacenter-services/:id', 
      element: <EquipmentDetailDatacenter />,
    },
  ],
  {
    basename: isGitHubPages ? '/Frontend' : '', 
  }
);

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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}> 
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);