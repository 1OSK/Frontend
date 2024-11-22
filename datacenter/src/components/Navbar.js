import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
// src/components/Navbar.tsx
import { Link } from 'react-router-dom';
import { useState } from 'react';
import '../assets/style.css';
const Navbar = () => {
    const [menuActive, setMenuActive] = useState(false);
    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };
    return (_jsxs("nav", { className: "navigation-bar mb-0", children: [_jsx(Link, { to: "/", className: "header-title", children: "Data Center" }), _jsxs("div", { className: `burger-menu ${menuActive ? 'active' : ''}`, onClick: toggleMenu, children: [_jsx("div", { className: "burger-line" }), _jsx("div", { className: "burger-line" }), _jsx("div", { className: "burger-line" })] }), _jsx("div", { className: `nav-links ${menuActive ? 'active' : ''}`, children: _jsx(Link, { to: "/datacenter-services/", className: "nav-link", children: "\u0421\u043F\u0438\u0441\u043E\u043A \u0442\u043E\u0432\u0430\u0440\u043E\u0432" }) })] }));
};
export default Navbar;
