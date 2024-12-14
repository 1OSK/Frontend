import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // useParams for getting the orderId from the URL
import { DatacenterOrder } from '../api/Api'; // Import interface for order data
import { loadOrders } from '../orderMethods/loadOrders'; // Assuming this function loads order details
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import '../assets/style.css';

const defaultImageUrl = '/images/default.png';

const OrderDetail = () => {
  const { orderId } = useParams(); // Get orderId from URL
  const [order, setOrder] = useState<DatacenterOrder | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (orderId) {
      setLoading(true);
      loadOrders(orderId, (orders) => {
        const foundOrder = orders.find((order) => order.id === parseInt(orderId, 10));
        if (foundOrder) {
          setOrder(foundOrder);
        } else {
          setError('Заказ не найден.');
        }
        setLoading(false);
      }, setError, setLoading);
    } else {
      setError('Invalid order ID.');
    }
  }, [orderId]);

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'Не указана'; // Return 'Не указана' if dateString is undefined or an empty string
    return new Date(dateString).toLocaleString();
  };

  if (loading) return <p>Загрузка...</p>;

  if (error) return <p>Ошибка: {error}</p>;

  if (!order) return <p>Заказ не найден.</p>;

  return (
    <div className="order-detail-container">
      <Navbar />
      <Breadcrumb
        items={[
          { label: 'Главная', path: '/' },
          { label: 'Список заказов', path: '/datacenter-orders/' },
          { label: `Заказ #${order.id}`, path: `/order-details/${order.id}` },
        ]}
      />

      <h3 className="order-detail-header">Детали заказа:</h3>

      <div className="order-detail">
        <p><strong>Заказ №:</strong> {order.id}</p>
        <p><strong>Статус:</strong> {order.status}</p>
        <p><strong>Дата создания:</strong> {formatTime(order.creation_date)}</p>
        <p><strong>Дата формирования:</strong> {order.formation_date ? formatTime(order.formation_date) : 'Не указана'}</p>
        <p><strong>Дата завершения:</strong> {order.completion_date ? formatTime(order.completion_date) : 'Не указана'}</p>
        <p><strong>Адрес доставки:</strong> {order.delivery_address || 'Не указан'}</p>
        <p><strong>Время доставки:</strong> {order.delivery_time ? formatTime(order.delivery_time) : 'Не указана'}</p>
        <p><strong>Сумма:</strong> {order.total_price !== undefined ? order.total_price : 'Не указана'}</p>

        <h4>Услуги:</h4>
        {order.datacenters && order.datacenters.length > 0 ? (
          <ul>
            {order.datacenters.map((datacenter, index) => (
              <li key={index} className="service-item">
                <p><strong>Услуга:</strong> {datacenter.service?.name || 'Не указано'}</p>
                <p><strong>Цена:</strong> {datacenter.service?.price || 'Не указана'}</p>
                <p><strong>Количество:</strong> {datacenter.quantity || 'Не указано'}</p>
                <div className="service-image-container">
                  <img
                    className="service-item-image"
                    src={datacenter.service?.image_url || defaultImageUrl}
                    alt={datacenter.service?.name || 'Услуга'}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = defaultImageUrl;
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Нет услуг в заказе.</p>
        )}
      </div>
    </div>
  );
};

export default OrderDetail;