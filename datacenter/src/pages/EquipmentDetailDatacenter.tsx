import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const EquipmentDetailDatacenter = () => {
    const { id } = useParams();
    const [equipment, setEquipment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEquipment = async () => {
            try {
                const response = await fetch(`/datacenter-services/${id}/`);
                if (!response.ok) throw new Error('Ошибка загрузки данных');
                const data = await response.json();
                console.log('Fetched data:', data); // Логируем данные
                setEquipment(data);
            } catch (err) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, [id]);

    if (loading) return <div>Загрузка...</div>;
    if (error) return <div>Ошибка: {error}</div>;
    if (!equipment) return <div>Нет данных для отображения.</div>;

    return (
        <>
            {/* Навигационная панель вне background-block */}
            <nav className="navigation-bar">
                <Link to="/" className="header-title">Data Center</Link>
            </nav>
            
            <div className="background-block" style={{ paddingTop: '60px' }}> {/* Отступ сверху для контента, чтобы не перекрывать навигацию */}
                <div className="service-detail-container">
                    <h1 className="service-title">{equipment.name}</h1>
                    <div className="service-info">
                        <div className="service-text"> {/* Новый контейнер для текста */}
                            <ul className="service-details">
                                {/* Разделяем описание на отдельные строки */}
                                {equipment.description ? (
                                    equipment.description.split(',').map((item, index) => (
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