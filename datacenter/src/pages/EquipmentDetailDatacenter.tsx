import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/style.css';

import { mockData } from '../mock/mockData';
import Breadcrumb from '../components/Breadcrumb';
import Navbar from '../components/Navbar'; 

const EquipmentDetailDatacenter = () => {
  const { id } = useParams<{ id: string }>();

  const [equipment, setEquipment] = useState<any | null>(null); // Для выбранного оборудования
  const [loading, setLoading] = useState(false); // Состояние загрузки
  const [error, setError] = useState<string | null>(null); // Состояние ошибки

  useEffect(() => {
    const fetchEquipment = async () => {
      setLoading(true); // Устанавливаем состояние загрузки
      setError(null); // Сбрасываем ошибки

      try {
        const response = await fetch(`/datacenter-services/${id}/`);
        if (!response.ok) throw new Error(`Ошибка загрузки данных: ${response.statusText}`);

        const data = await response.json();
        setEquipment(data); // Устанавливаем полученные данные в локальное состояние
        setError(null); // Сбрасываем ошибку
      } catch (err) {
        console.error('Ошибка запроса:', err);

        // Проверяем наличие моковых данных
        const mockItem = mockData.find(item => item.id === Number(id));
        if (mockItem) {
          setEquipment(mockItem); // Используем моковые данные
          setError(null); // Сбрасываем ошибку
        } else {
          setError('Комплектующее не найдено в моковых данных.'); // Ошибка, если моковых данных нет
        }
      } finally {
        setLoading(false); // Завершаем загрузку
      }
    };

    fetchEquipment();
  }, [id]); // Вставляем только id, так как dispatch здесь не используется

  // Рендерим состояние загрузки или ошибки
  if (loading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error}</div>;
  if (!equipment) return <div>Нет данных для отображения.</div>; // Если нет данных

  // Определяем элементы для хлебной крошки
  const breadcrumbItems = [
    { label: 'Главная', path: '/' },
    { label: 'Список товаров', path: '/datacenter-services' },
    { label: equipment.name, path: '#' },
  ];




  return (
    <>
      <Navbar />

      <Breadcrumb items={breadcrumbItems} />

      <div className="background-block" style={{ paddingTop: '10px' }}>
        <div className="service-detail-container">
        <h1 className="service-title">{equipment.name}</h1>
            <div className="service-info">
            <img 
                src={equipment.image_url || "http://127.0.0.1:9000/something/default.png"} 
                alt={equipment.name} 
                className="service-detail-image" 
            />
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
            </div>
        </div>
      </div>
    </>
  );
};

export default EquipmentDetailDatacenter;