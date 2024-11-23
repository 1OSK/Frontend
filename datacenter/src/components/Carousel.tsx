import React, { useState } from 'react';
import '../assets/style.css';

const Carousel: React.FC = () => {
    const [index, setIndex] = useState(0);
    const images = ['https://1osk.github.io/Frontend/images/1.png', 'https://1osk.github.io/Frontend/images/2.png', 'https://1osk.github.io/Frontend/images/3.png', 'https://1osk.github.io/Frontend/images/4.png', 'https://1osk.github.io/Frontend/images/5.png'];

    // Индексы левого и правого изображений
    const leftIndex = (index - 1 + images.length) % images.length;
    const rightIndex = (index + 1) % images.length;

    // Обработчик кликов
    const handleClick = (direction: 'left' | 'right') => {
        if (direction === 'left') {
            setIndex(leftIndex);
        } else if (direction === 'right') {
            setIndex(rightIndex);
        }
    };

    return (
        <div className="carousel">
            <div className="carousel-images">
                {/* Левое изображение */}
                <img
                    src={images[leftIndex]}
                    alt=""
                    className="carousel-image small"
                    onClick={() => handleClick('left')}
                />
                {/* Центральное изображение */}
                <img
                    src={images[index]}
                    alt=""
                    className="carousel-image large"
                />
                {/* Правое изображение */}
                <img
                    src={images[rightIndex]}
                    alt=""
                    className="carousel-image small"
                    onClick={() => handleClick('right')}
                />
            </div>
        </div>
    );
};

export default Carousel;