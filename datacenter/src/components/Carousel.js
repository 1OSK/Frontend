import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import '../assets/style.css';
const Carousel = () => {
    const [index, setIndex] = useState(0);
    const images = ['/images/1.png', '/images/2.png', '/images/3.png', '/images/4.png', '/images/5.png'];
    // Индексы левого и правого изображений
    const leftIndex = (index - 1 + images.length) % images.length;
    const rightIndex = (index + 1) % images.length;
    // Обработчик кликов
    const handleClick = (direction) => {
        if (direction === 'left') {
            setIndex(leftIndex);
        }
        else if (direction === 'right') {
            setIndex(rightIndex);
        }
    };
    return (_jsx("div", { className: "carousel", children: _jsxs("div", { className: "carousel-images", children: [_jsx("img", { src: images[leftIndex], alt: "", className: "carousel-image small", onClick: () => handleClick('left') }), _jsx("img", { src: images[index], alt: "", className: "carousel-image large" }), _jsx("img", { src: images[rightIndex], alt: "", className: "carousel-image small", onClick: () => handleClick('right') })] }) }));
};
export default Carousel;
