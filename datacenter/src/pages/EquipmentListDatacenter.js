import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/style.css';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import { setMinPrice, setMaxPrice } from '../slices/dataSlice';
import { mockData } from '../mock/mockData';
import Navbar from '../components/Navbar';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
export const EquipmentListDatacenter = () => {
    const dispatch = useDispatch();
    const minPrice = useSelector((state) => state.ourData.minPrice);
    const maxPrice = useSelector((state) => state.ourData.maxPrice);
    const [services, setServices] = useState(mockData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const defaultImageUrl = 'https://1osk.github.io/Frontend/images/default.png';
    const breadcrumbItems = [
        { label: 'Главная', path: '/' },
        { label: 'Список товаров', path: '/datacenter-services' },
    ];
    useEffect(() => {
        fetchServices();
    }, []);
    const fetchServices = async () => {
        setLoading(true);
        setError(null);
        let url = '/datacenter-services/';
        if (minPrice || maxPrice) {
            url += `?datacenter_min_price=${minPrice}&datacenter_max_price=${maxPrice}`;
        }
        try {
            const response = await fetch(url);
            if (!response.ok)
                throw new Error('Ошибка при загрузке данных');
            const data = await response.json();
            setServices(data.datacenters);
        }
        catch (err) {
            setError('Ошибка при загрузке данных');
        }
        finally {
            setLoading(false);
        }
    };
    const handleSearch = (e) => {
        e.preventDefault();
        fetchServices();
    };
    return (_jsxs(_Fragment, { children: [_jsx(Navbar, {}), _jsxs("div", { className: "breadcrumb-container", children: [_jsx(Breadcrumb, { items: breadcrumbItems }), _jsx("div", { className: "order-info", children: _jsx("span", { className: "current-order-button disabled text-muted", children: "\u0422\u0435\u043A\u0443\u0449\u0438\u0439 \u0437\u0430\u043A\u0430\u0437 \u043D\u0435\u0434\u043E\u0441\u0442\u0443\u043F\u0435\u043D" }) }), _jsx("div", { className: "breadcrumb-controls", children: _jsxs(Form, { className: "", onSubmit: handleSearch, children: [_jsx(Slider, { range: true, min: 0, max: 1000000, step: 1000, value: [parseInt(minPrice) || 0, parseInt(maxPrice) || 100000], onChange: (value) => {
                                        if (Array.isArray(value)) {
                                            const [newMin, newMax] = value;
                                            dispatch(setMinPrice(newMin.toString()));
                                            dispatch(setMaxPrice(newMax.toString()));
                                        }
                                    }, className: "w-100 mb-3" }), _jsxs("div", { className: "price-labels ", children: [_jsxs("span", { children: [minPrice || '0', " \u0440\u0443\u0431."] }), _jsxs("span", { children: [maxPrice || '100000', " \u0440\u0443\u0431."] })] }), _jsx(Button, { type: "submit", className: "custom-search-button w-100 py-3", disabled: loading, children: loading ? _jsx(Spinner, { animation: "border", size: "sm" }) : 'Поиск' })] }) })] }), _jsxs(Container, { className: "space", children: [loading && _jsx(Spinner, { animation: "border" }), error && _jsx(Alert, { variant: "danger", children: error }), _jsx(Row, { children: services.map(service => (_jsx(Col, { xs: 12, sm: 6, md: 5, lg: 4, className: "mb-4", children: _jsxs("div", { className: "card", children: [_jsx(Link, { to: `/datacenter-services/${service.id}/`, className: "card-title", children: _jsx("p", { className: "title", children: service.name }) }), _jsx("div", { className: "image-container", children: _jsx("img", { src: service.image_url || defaultImageUrl, alt: service.name, className: "service-image" }) }), _jsxs("div", { className: "card-price-button-container", style: { marginTop: 'auto' }, children: [service.price && _jsxs("p", { className: "price", children: [service.price, " \u0440\u0443\u0431."] }), _jsxs("div", { className: "button-container", children: [_jsx(Link, { to: `/datacenter-services/${service.id}/`, className: "card-button", children: "\u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435 \u043E \u043A\u043E\u043C\u043F\u043B\u0435\u043A\u0442\u0443\u044E\u0449\u0435\u043C" }), _jsx("div", { className: "add-button-container", children: _jsx(Button, { variant: "secondary", disabled: true, className: "card-button disabled", children: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u0432 \u0437\u0430\u043A\u0430\u0437" }) })] })] })] }) }, service.id))) })] })] }));
};
export default EquipmentListDatacenter;
