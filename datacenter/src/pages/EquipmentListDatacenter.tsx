import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/style.css';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb'; // Импортируем Breadcrumb

export interface DatacenterService {
    id: number;
    name: string;
    description: string | null;
    image_url: string | null;
    price: number;
}
export const mockData: DatacenterService[] = [
    {
        id: 1,
        name: 'Моковый сервер',
        description: 'Моковые данные для тестирования',
        image_url: null,
        price: 10000,
    },
    {
        id: 2,
        name: 'Виртуальный сервер',
        description: 'Еще один сервер с мок-данными',
        image_url: null,
        price: 15000,
    },
    {
        id: 3,
        name: 'Виртуальный сервер',
        description: 'Еще один сервер с мок-данными',
        image_url: null,
        price: 15000,
    },
    {
        id: 4,
        name: 'Виртуальный сервер',
        description: 'Еще один сервер с мок-данными',
        image_url: null,
        price: 15000,
    },
    {
        id: 5,
        name: 'Виртуальный сервер',
        description: 'Еще один сервер с мок-данными',
        image_url: null,
        price: 15000,
    },
    {
        id: 6,
        name: 'Виртуальный сервер',
        description: 'Еще один сервер с мок-данными',
        image_url: null,
        price: 15000,
    },
   
];
const EquipmentListDatacenter: React.FC = () => {
    const [services, setServices] = useState<DatacenterService[]>([]);
    const [minPrice, setMinPrice] = useState<number | ''>('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [menuActive, setMenuActive] = useState(false);

    const defaultImageUrl = 'http://127.0.0.1:9000/something/default.png';

    const breadcrumbItems = [
        { label: 'Главная', path: '/' },
        { label: 'Список товаров', path: '/datacenter-services' },
    ];

    // componentDidMount: выполняется один раз при монтировании компонента
    useEffect(() => {
        fetchServices();
    }, []);

    // Функция для получения данных
    const fetchServices = async () => {
        setLoading(true);
        setError(null);

        let url = '/datacenter-services/';
        if (minPrice !== '' || maxPrice !== '') {
            url += `?datacenter_min_price=${minPrice}&datacenter_max_price=${maxPrice}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Ошибка при загрузке данных');
            const data = await response.json();
            setServices(data.datacenters);
        } catch (err) {
            setError('Ошибка при загрузке данных, использую моковые данные');
            setServices(mockData); // Используем моки при ошибке
        } finally {
            setLoading(false);
        }
    };

    // componentDidUpdate: логика поиска выполняется при нажатии кнопки "Поиск"
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchServices(); // вызываем fetchServices с фильтром
    };

    const handlePriceChange = (setter: React.Dispatch<React.SetStateAction<number | ''>>) => 
        (e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value ? Number(e.target.value) : '');
    const toggleMenu = () => {
        setMenuActive(!menuActive); // Переключение состояния меню
    };

    return (
        <>
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

            <div className="breadcrumb-container">
        <Breadcrumb items={breadcrumbItems} />

        <div className="breadcrumb-controls">
          {/* Форма поиска */}
          <Form className="search-form d-flex flex-column" onSubmit={handleSearch}>
            <Form.Control
              type="number"
              placeholder="Минимальная цена..."
              value={minPrice}
              onChange={handlePriceChange(setMinPrice)}
              min="0"
              className="search-input"
            />
            <Form.Control
              type="number"
              placeholder="Максимальная цена..."
              value={maxPrice}
              onChange={handlePriceChange(setMaxPrice)}
              min="0"
              className="search-input"
            />
            <Button variant="primary" type="submit" className="search-button" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Поиск'}
            </Button>
          </Form>

          {/* Кнопка корзины */}
          <div className="order-info">
            <span className="current-order-button disabled">Текущий заказ недоступен</span>
          </div>
        </div>
      </div>

        <Container className="space">
        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        <Row>
            {services.map(service => (
                <Col key={service.id} md={4} className="mb-4">
                    <div className="card">
                        <Link to={`/datacenter-services/${service.id}/`} className="card-title">
                            <p className="title">{service.name}</p>
                        </Link>
                        <div className="image-container">
                            <img 
                                src={service.image_url || defaultImageUrl} 
                                alt={service.name} 
                                className="service-image" 
                            />
                        </div>
                        <div className="card-price-button-container" style={{ marginTop: 'auto' }}>
                            {service.price && <p className="price">{service.price} руб.</p>}
                            <div className="button-container">
                                <Link to={`/datacenter-services/${service.id}/`} className="card-button">Подробнее о комплектующем</Link>
                                <div className="add-button-container">
                                    <Button variant="secondary" disabled className="card-button disabled">Добавить в заказ</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            ))}
        </Row>
    </Container>
        </>
    );
};

export default EquipmentListDatacenter;