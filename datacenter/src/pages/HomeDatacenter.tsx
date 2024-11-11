import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/style.css';

const HomeDatacenter: React.FC = () => {
    const [menuActive, setMenuActive] = useState(false);

    const toggleMenu = () => {
        setMenuActive(!menuActive);
    };

    useEffect(() => {
        console.log("Компонент HomeDatacenter был смонтирован!");
    }, []);

    return (
        <>
            {/* Навигационная панель */}
            <nav className="navigation-bar mb-0">
                <Link to="/" className="header-title">Data Center</Link>
                
                <div className={`nav-links ${menuActive ? 'active' : ''}`}>
                    <Link to="/datacenter-services/" className="nav-link">Список товаров</Link>
                </div>

                {/* Бургер-иконка */}
                <div className={`burger-menu ${menuActive ? 'active' : ''}`} onClick={toggleMenu}>
                    <div className="burger-line"></div>
                    <div className="burger-line"></div>
                    <div className="burger-line"></div>
                </div>
            </nav>
            

            {/* Основной контент */}
            <div className="home-container">
                <h1>Добро пожаловать в Центр Данных</h1>
                <p>Изучите наше доступное оборудование.</p>
                
                {/* Кнопка для перехода к списку комплектующих */}
                <Link to={"/datacenter-services"} className="card-button">Список комплектующих</Link>
            </div>
        </>
    );
};

export default HomeDatacenter;