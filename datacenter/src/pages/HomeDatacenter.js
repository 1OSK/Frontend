import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect } from 'react';
import '../assets/style.css';
import Carousel from '../components/Carousel';
import Navbar from '../components/Navbar';
const HomeDatacenter = () => {
    useEffect(() => {
        console.log("Компонент HomeDatacenter был смонтирован!");
    }, []);
    return (_jsxs(_Fragment, { children: [_jsx(Navbar, {}), _jsxs("div", { className: "home-container", children: [_jsx("h1", { children: "\u0414\u043E\u0431\u0440\u043E \u043F\u043E\u0436\u0430\u043B\u043E\u0432\u0430\u0442\u044C \u0432 \u0426\u0435\u043D\u0442\u0440 \u0414\u0430\u043D\u043D\u044B\u0445" }), _jsx(Carousel, {})] })] }));
};
export default HomeDatacenter;
