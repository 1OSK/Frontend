import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/style.css';

const HomeDatacenter: React.FC = () => {
    return (
        <>
            {/* Навигационная панель */}
            <nav className="navigation-bar">
            <Link to="/" className="header-title">Data Center</Link> {/* Title link is separate */}
                
                <div className="nav-links">
                    <Link to="/datacenter-services/" className="nav-link">Список товаров</Link>
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