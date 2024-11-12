import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/style.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store'; // Импортируем тип RootState
import { setSelectedService, setLoading, setError } from '../slices/dataSlice'; // действия для Redux
import Breadcrumb from '../components/Breadcrumb';
import { mockData } from '../slices/dataSlice'; // Моковые данные из Redux

const EquipmentDetailDatacenter = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  
  // Используем состояние из Redux
  const equipment = useSelector((state: RootState) => state.ourData.selectedService);
  const loading = useSelector((state: RootState) => state.ourData.loading);
  const error = useSelector((state: RootState) => state.ourData.error);

  // Эффект для загрузки данных
  useEffect(() => {
    const fetchEquipment = async () => {
      dispatch(setLoading(true)); // Устанавливаем состояние загрузки
      dispatch(setError(null)); // Сбрасываем ошибки

      try {
        const response = await fetch(`/datacenter-services/${id}/`);
        if (!response.ok) throw new Error(`Ошибка загрузки данных: ${response.statusText}`);
        
        const data = await response.json();
        dispatch(setSelectedService(data)); // Обновляем данные в Redux
        dispatch(setError(null)); // Сбрасываем ошибку
      } catch (err) {
        console.error('Ошибка запроса:', err);
        
        // Проверяем наличие моковых данных
        const mockItem = mockData.find(item => item.id === Number(id));
        if (mockItem) {
          dispatch(setSelectedService(mockItem)); // Используем моковые данные
          dispatch(setError(null)); // Сбрасываем ошибку
        } else {
          dispatch(setError('Комплектующее не найдено в моковых данных.'));
        }
      } finally {
        dispatch(setLoading(false)); // Завершаем загрузку
      }
    };

    fetchEquipment();
  }, [id, dispatch]);

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
      <nav className="navigation-bar">
        <Link to="/" className="header-title">Data Center</Link>
        <div className="nav-links">
          <Link to="/datacenter-services/" className="nav-link">Список товаров</Link>
        </div>
      </nav>

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
                    equipment.description.split(',').map((item, index) => (
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