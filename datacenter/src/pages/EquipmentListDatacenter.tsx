import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Form, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/style.css';

interface DatacenterService {
    id: number;
    name: string;
    description: string | null;
    image_url: string | null;
    price: number;
}

const EquipmentListDatacenter: React.FC<{ isAuthenticated: boolean; currentOrderId: number | null }> = ({ isAuthenticated, currentOrderId }) => {
    const [services, setServices] = useState<DatacenterService[]>([]);
    const [minPrice, setMinPrice] = useState<number | ''>('');
    const [maxPrice, setMaxPrice] = useState<number | ''>('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchServices();
    }, [minPrice, maxPrice]);

    const fetchServices = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/datacenter-services/?datacenter_min_price=${minPrice}&datacenter_max_price=${maxPrice}`);
            if (!response.ok) throw new Error('Ошибка при загрузке данных');
            const data = await response.json();
            setServices(data.datacenters);
        } catch (err) {
            setError('Ошибка при загрузке данных');
        } finally {
            setLoading(false);
        }
    };

    const handlePriceChange = (setter: React.Dispatch<React.SetStateAction<number | ''>>) => 
        (e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.value ? Number(e.target.value) : '');

    const handleAddToOrder = (serviceId: number) => {
        console.log(`Добавлено в заказ: ${serviceId}`);
    };

    return (
        <Container className="space">
            <h1 className="page-title">Список услуг датацентра</h1>

            <nav className="navigation-bar">
                <a href="{% url 'service_list_datacenter' %}" className="header-title">Data Center</a>
                <Form className="search-form" onSubmit={(e) => { e.preventDefault(); fetchServices(); }}>
                    <Form.Group className="d-flex">
                        <Form.Control
                            type="number"
                            placeholder="Максимальная цена..."
                            value={maxPrice}
                            onChange={handlePriceChange(setMaxPrice)}
                            min="0"
                            className="search-input"
                        />
                        <Button variant="primary" type="submit" className="search-button">Поиск</Button>
                    </Form.Group>
                </Form>

                <div className={`order-info ${!isAuthenticated ? 'inactive' : ''}`}>
                    {isAuthenticated && currentOrderId ? (
                        <a href={`/order-detail/${currentOrderId}`} className="current-order-button">
                            Текущий заказ (Оборудование: {/* Тут можно указать количество оборудования */} 0)
                        </a>
                    ) : (
                        <a href="#" className="current-order-button disabled" disabled>Текущий заказ недоступен</a>
                    )}
                </div>
            </nav>

            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}

            <Row>
                {services.map(service => (
                    <Col key={service.id} md={4} className="mb-4">
                        <div className="card">
                            <a href={`/service-detail/${service.id}`} className="card-title">
                                <p className="title">{service.name}</p>
                            </a>
                            <div className="image-container">
                                {service.image_url ? (
                                    <img src={service.image_url} alt={service.name} className="service-image" />
                                ) : (
                                    <div className="no-image">
                                        <span>Нет изображения</span>
                                    </div>
                                )}
                            </div>
                            <div className="card-price-button-container" style={{ marginTop: 'auto' }}>
                                {service.price && <p className="price">{service.price} руб.</p>}
                                <div className="button-container">
                                    <a href={`/service-detail/${service.id}`} className="card-button">Подробнее о комплектующем</a>
                                    <div className="add-button-container">
                                        {isAuthenticated ? (
                                            <Button variant="success" onClick={() => handleAddToOrder(service.id)} className="card-button">
                                                Добавить в заказ
                                            </Button>
                                        ) : (
                                            <Button variant="secondary" disabled className="card-button disabled">Добавить в заказ</Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default EquipmentListDatacenter;