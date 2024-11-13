import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../assets/style.css';
import Navbar from '../components/Navbar'; 
const HomeDatacenter: React.FC = () => {


    useEffect(() => {
        console.log("Компонент HomeDatacenter был смонтирован!");
    }, []);

    return (
        <>
            
            <Navbar />

            <div className="home-container">
                <h1>Добро пожаловать в Центр Данных</h1>
                <p>Изучите наше доступное оборудование.</p>
                
                
                <Link to={"/datacenter-services"} className="card-button">Список комплектующих</Link>
            </div>
        </>
    );
};

export default HomeDatacenter;