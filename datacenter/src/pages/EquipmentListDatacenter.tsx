import React, { useEffect, useState } from 'react';
import axios from 'axios';
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
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

export const EquipmentListDatacenter: React.FC = () => {
  const dispatch = useDispatch();
  const minPrice = useSelector((state: RootState) => state.ourData.minPrice);
  const maxPrice = useSelector((state: RootState) => state.ourData.maxPrice);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const [services, setServices] = useState(mockData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const defaultImageUrl = '/images/default.png';

  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Список товаров', path: '/datacenter-services' },
  ];

  // Функция для загрузки данных при монтировании
  useEffect(() => {
    fetchServices();
  }, [isAuthenticated]);  // Если статус авторизации изменится, перезагрузим данные

  const fetchServices = async () => {
    setLoading(true);
    setError(null);

    let url = '/datacenter-services/';
    const params: Record<string, string | number> = {};

    if (minPrice) params.datacenter_min_price = minPrice;
    if (maxPrice) params.datacenter_max_price = maxPrice;

    try {
      const response = await axios.get(url, { params });
      setServices(response.data.datacenters);
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

        <div className="order-info">
          <span
            className={`current-order-button ${isAuthenticated ? '' : 'disabled text-muted'}`}
            style={isAuthenticated ? {  } : {}}
          >
            {isAuthenticated ? 'Оформить заказ' : 'Войдите, чтобы оформить заказ'}
          </span>
        </div>

        <div className="breadcrumb-controls">
          <Form onSubmit={handleSearch}>
            <Slider
              range
              min={0}
              max={1000000}
              step={1000}
              value={[parseInt(minPrice) || 0, parseInt(maxPrice) || 100000]}
              onChange={(value: number | number[]) => {
                if (Array.isArray(value)) {
                  const [newMin, newMax] = value;
                  dispatch(setMinPrice(newMin.toString()));
                  dispatch(setMaxPrice(newMax.toString()));
                }
              }}
              className="w-100 mb-3"
            />
            <div className="price-labels">
              <span>{minPrice || '0'} руб.</span>
              <span>{maxPrice || '100000'} руб.</span>
            </div>
            <Button type="submit" className="custom-search-button w-100 py-3" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Поиск'}
            </Button>
          </Form>
        </div>
      </div>

      <Container className="space">
        {loading && <Spinner animation="border" />}
        {error && <Alert variant="danger">{error}</Alert>}
        <Row>
          {services.map(service => (
            <Col key={service.id} xs={12} sm={6} md={5} lg={4} className="mb-4">
              <div className="card">
                <Link to={`/datacenter-services/${service.id}/`} className="card-title">
                  <p className="title">{service.name}</p>
                </Link>
                <div className="image-container">
                  <img
                    src={service.image_url || defaultImageUrl}
                    alt={service.name}
                    className="service-image"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = defaultImageUrl;
                    }}
                  />
                </div>
                <div className="card-price-button-container" style={{ marginTop: 'auto' }}>
                  {service.price && <p className="price">{service.price} руб.</p>}
                  <div className="button-container">
                    <Link to={`/datacenter-services/${service.id}/`} className="card-button">
                      Подробнее о комплектующем
                    </Link>
                    {isAuthenticated && (
                      <div className="add-button-container">
                        <Button variant="secondary" className="card-button">
                          Добавить в заказ
                        </Button>
                      </div>
                    )}
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