import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/style.css';
import { Link } from 'react-router-dom';
import Breadcrumb from '../components/Breadcrumb';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store';
import { setMinPrice, setMaxPrice } from '../slices/dataSlice';
import { mockData } from '../mock/mockData';
import Navbar from '../components/Navbar'; 

export const EquipmentListDatacenter: React.FC = () => {
  const dispatch = useDispatch();
  const minPrice = useSelector((state: RootState) => state.ourData.minPrice);
  const maxPrice = useSelector((state: RootState) => state.ourData.maxPrice);

  const [services, setServices] = useState(mockData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const defaultImageUrl = 'https://1osk.github.io/Frontend/images/2.png';

  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Список товаров', path: '/datacenter-services' },
  ];

  useEffect(() => {
    const storedMinPrice = localStorage.getItem('minPrice');
    const storedMaxPrice = localStorage.getItem('maxPrice');
    
    if (storedMinPrice) dispatch(setMinPrice(storedMinPrice));
    if (storedMaxPrice) dispatch(setMaxPrice(storedMaxPrice));

    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);

    let url = '/datacenter-services/';
    if (minPrice || maxPrice) {
      url += `?datacenter_min_price=${minPrice}&datacenter_max_price=${maxPrice}`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Ошибка при загрузке данных');
      const data = await response.json();
      setServices(data.datacenters);
    } catch (err) {
      setError('Ошибка при загрузке данных');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchServices();
  };





  return (
    <>
      <Navbar />

      <div className="breadcrumb-container">
        <Breadcrumb items={breadcrumbItems} />

        <div className="breadcrumb-controls">
          <Form className="search-form d-flex" onSubmit={handleSearch}>
          <Form.Control
            type="number"
            placeholder="Минимальная цена..."
            value={minPrice}
            onChange={(e) => dispatch(setMinPrice(e.target.value))} 
            min="0"
            className="search-input"
          />

          <Form.Control
            type="number"
            placeholder="Максимальная цена..."
            value={maxPrice}
            onChange={(e) => dispatch(setMaxPrice(e.target.value))}
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
                <img src={service.image_url || defaultImageUrl} alt={service.name} className="service-image" />
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