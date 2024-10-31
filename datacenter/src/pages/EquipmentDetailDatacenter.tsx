import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DatacenterService } from './EquipmentListDatacenter';
import Breadcrumb from '../components/Breadcrumb'; // Импортируем компонент Breadcrumb

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
                if (!response.ok) throw new Error('Ошибка загрузки данных');
                const data: DatacenterService = await response.json();
                setEquipment(data);
            } catch (err) {
                console.error('Fetch error:', err);
                setError((err as Error).message); 
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
                <Link to="/" className="header-title">Data Center</Link> {/* Ссылка на главную страницу */}
                
                <div className="nav-links">
                    <Link to="/datacenter-services/" className="nav-link">Список товаров</Link>
                </div>
            </nav>
            
            {/* Хлебные крошки располагаются под навигационной панелью */}
            <Breadcrumb items={breadcrumbItems} />

            <div className="background-block" style={{ paddingTop: '20px' }}> {/* Увеличиваем верхний отступ для удобства */}
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
                        {equipment.image_url && (
                            <img src={equipment.image_url} alt={equipment.name} className="service-detail-image" />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default EquipmentDetailDatacenter;