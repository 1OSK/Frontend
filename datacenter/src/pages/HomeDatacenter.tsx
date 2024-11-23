import React, { useEffect } from 'react';
import '../assets/style.css';
import Carousel from '../components/Carousel';
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
                <Carousel />
            </div>
        </>
    );
};

export default HomeDatacenter;