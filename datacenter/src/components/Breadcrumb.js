import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
import '../assets/style.css';
const Breadcrumb = ({ items }) => {
    return (_jsx("nav", { className: "breadcrumb", children: items.map((item, index) => (_jsxs("span", { children: [_jsx(Link, { to: item.path, className: "breadcrumb-link", children: item.label }), index < items.length - 1 && ' > '] }, index))) }));
};
export default Breadcrumb;
