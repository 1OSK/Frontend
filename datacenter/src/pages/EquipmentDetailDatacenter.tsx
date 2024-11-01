import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/style.css';
import { DatacenterService, mockData } from './EquipmentListDatacenter'; // Предполагается, что mockData определены здесь
import Breadcrumb from '../components/Breadcrumb';

const EquipmentDetailDatacenter = () => {
    const { id } = useParams<{ id: string }>(); // Получаем id из параметров
    const [equipment, setEquipment] = useState<DatacenterService | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Функция для получения информации о комплектующем
    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const response = await fetch(`/datacenter-services/${id}/`);
                if (!response.ok) throw new Error(`Ошибка загрузки данных: ${response.statusText}`);
                const data: DatacenterService = await response.json();
                setEquipment(data);
            } catch (err) {
                console.error('Fetch error:', err);
                // Используем моковые данные
                const mockItem = mockData.find(item => item.id === Number(id));
                if (mockItem) {
                    setEquipment(mockItem);
                    setError(null); // Сбрасываем ошибку, если нашли моковые данные
                } else {
                    setError('Комплектующее не найдено в моковых данных.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, [id]);

    // Проверяем состояния загрузки, ошибки и отсутствия данных
    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    if (!equipment) return <div>Нет данных для отображения.</div>;

    // Определяем элементы для хлебной крошки
    const breadcrumbItems = [
        { label: 'Главная', path: '/' },
        { label: 'Список товаров', path: '/datacenter-services' },
        { label: equipment.name, path: '#' } // Текущий элемент не должен вести никуда
    ];

    return (
        <>
            <nav className="navigation-bar">
                <Link to="/" className="header-title">Data Center</Link>
                <div className="nav-links">
                    <Link to="/datacenter-services/" className="nav-link">Список товаров</Link>
                </div>
            </nav>

            <Breadcrumb items={breadcrumbItems} />

            <div className="background-block" style={{ paddingTop: '20px' }}>
                <div className="service-detail-container">
                    <h1 className="service-title">{equipment.name}</h1>
                    <div className="service-info">
                        <div className="service-text">
                            <ul className="service-details">
                                {equipment.description ? (
                                    equipment.description.split(',').map((item: string, index: number) => (
                                        <li key={index}>• {item.trim()}</li>
                                    ))
                                ) : (
                                    <li>Информация о деталях недоступна.</li>
                                )}
                            </ul>
                            <p className="price"><strong>Цена:</strong> {equipment.price} руб.</p>
                        </div>
                        {equipment.image_url ? (
                            <img src={equipment.image_url} alt={equipment.name} className="service-detail-image" />
                        ) : (
                            <img src="http://127.0.0.1:9000/something/default.png" alt="Изображение отсутствует" className="service-detail-image" />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default EquipmentDetailDatacenter;