import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/style.css';
import { mockData } from '../mock/mockData';
import Breadcrumb from '../components/Breadcrumb';
import Navbar from '../components/Navbar';
const EquipmentDetailDatacenter = () => {
    const { id } = useParams();
    const [equipment, setEquipment] = useState(null); // Для выбранного оборудования
    const [loading, setLoading] = useState(false); // Состояние загрузки
    const [error, setError] = useState(null); // Состояние ошибки
    useEffect(() => {
        const fetchEquipment = async () => {
            setLoading(true); // Устанавливаем состояние загрузки
            setError(null); // Сбрасываем ошибки
            try {
                const response = await fetch(`/datacenter-services/${id}/`);
                if (!response.ok)
                    throw new Error(`Ошибка загрузки данных: ${response.statusText}`);
                const data = await response.json();
                setEquipment(data); // Устанавливаем полученные данные в локальное состояние
                setError(null); // Сбрасываем ошибку
            }
            catch (err) {
                console.error('Ошибка запроса:', err);
                // Проверяем наличие моковых данных
                const mockItem = mockData.find(item => item.id === Number(id));
                if (mockItem) {
                    setEquipment(mockItem); // Используем моковые данные
                    setError(null); // Сбрасываем ошибку
                }
                else {
                    setError('Комплектующее не найдено в моковых данных.'); // Ошибка, если моковых данных нет
                }
            }
            finally {
                setLoading(false); // Завершаем загрузку
            }
        };
        fetchEquipment();
    }, [id]); // Вставляем только id, так как dispatch здесь не используется
    // Рендерим состояние загрузки или ошибки
    if (loading)
        return _jsx("div", { children: "\u0417\u0430\u0433\u0440\u0443\u0437\u043A\u0430..." });
    if (error)
        return _jsxs("div", { children: ["\u041E\u0448\u0438\u0431\u043A\u0430: ", error] });
    if (!equipment)
        return _jsx("div", { children: "\u041D\u0435\u0442 \u0434\u0430\u043D\u043D\u044B\u0445 \u0434\u043B\u044F \u043E\u0442\u043E\u0431\u0440\u0430\u0436\u0435\u043D\u0438\u044F." }); // Если нет данных
    // Определяем элементы для хлебной крошки
    const breadcrumbItems = [
        { label: 'Главная', path: '/' },
        { label: 'Список товаров', path: '/datacenter-services' },
        { label: equipment.name, path: '#' },
    ];
    return (_jsxs(_Fragment, { children: [_jsx(Navbar, {}), _jsx(Breadcrumb, { items: breadcrumbItems }), _jsx("div", { className: "background-block", style: { paddingTop: '10px' }, children: _jsxs("div", { className: "service-detail-container", children: [_jsx("h1", { className: "service-title", children: equipment.name }), _jsxs("div", { className: "service-info", children: [_jsx("img", { src: equipment.image_url || "http://127.0.0.1:9000/something/default.png", alt: equipment.name, className: "service-detail-image" }), _jsxs("div", { className: "service-text", children: [_jsx("ul", { className: "service-details", children: equipment.description ? (equipment.description.split(',').map((item, index) => (_jsxs("li", { children: ["\u2022 ", item.trim()] }, index)))) : (_jsx("li", { children: "\u0418\u043D\u0444\u043E\u0440\u043C\u0430\u0446\u0438\u044F \u043E \u0434\u0435\u0442\u0430\u043B\u044F\u0445 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0430." })) }), _jsxs("p", { className: "price", children: [_jsx("strong", { children: "\u0426\u0435\u043D\u0430:" }), " ", equipment.price, " \u0440\u0443\u0431."] })] })] })] }) })] }));
};
export default EquipmentDetailDatacenter;
