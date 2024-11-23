import { jsx as _jsx } from "react/jsx-runtime";
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
    { path: '/', element: _jsx(HomeDatacenter, {}) },
    { path: '/datacenter-services', element: _jsx(EquipmentListDatacenter, {}) },
    { path: '/datacenter-services/:id', element: _jsx(EquipmentDetailDatacenter, {}) },
]);
function App() {
    return (_jsx(Provider, { store: store, children: _jsx(RouterProvider, { router: router }) }));
}
export default App;
