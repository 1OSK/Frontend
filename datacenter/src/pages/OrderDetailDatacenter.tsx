import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import Breadcrumb from '../components/Breadcrumb';
import { RootState } from '../store';
import { DatacenterOrder, DatacenterOrderService } from '../api/Api';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css"; 
import { FaCalendarAlt } from 'react-icons/fa';
import { handleSubmitOrder } from '../orderMethods/handleSubmitOrder';
import { handleDeleteService } from '../orderMethods/handleDeleteService';
import { handleQuantityChange } from '../orderMethods/handleQuantityChange';
import { fetchOrderDetails } from '../orderMethods/fetchOrderDetails'; 
import { loadOrders } from '../orderMethods/loadOrders'; 
import '../assets/style.css';
const defaultImageUrl = '/images/default.png';

const formatTime = (time: Date | string | null) => {
  if (!time) return 'Не выбрано';
  const date = typeof time === 'string' ? new Date(time) : time;
  if (isNaN(date.getTime())) return 'Некорректная дата';
  return date.toLocaleString('ru-RU', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const OrderDetailDatacenter = () => {
  const sessionId = useSelector((state: RootState) => state.auth.sessionId);
  const draftOrderId = useSelector((state: RootState) => state.ourData.draftOrderId);
  
  const [isFromBurger, setIsFromBurger] = useState(false);
  const [orders, setOrders] = useState<DatacenterOrder[]>([]);
  const [orderDetails, setOrderDetails] = useState<DatacenterOrder | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('');
  const [deliveryTime, setDeliveryTime] = useState<Date | null>(null);
  const [quantity, setQuantity] = useState<number | null>(null);

  // Типизированное состояние для expandedOrders
  const [expandedOrders, setExpandedOrders] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const fromBurger = urlParams.get('fromBurger');
    if (fromBurger === 'true') {
      setIsFromBurger(true);
    }
  }, []);

  useEffect(() => {
    if (sessionId) {
      loadOrders(sessionId, setOrders, setError, setLoading);
    } else {
      setError('Необходимо авторизоваться');
    }
  }, [sessionId]);

  useEffect(() => {
    if (sessionId && draftOrderId && draftOrderId !== null && !isFromBurger) {
      fetchOrderDetails(
        sessionId,
        draftOrderId.toString(),
        setLoading,
        setError,
        setOrderDetails,
        setDeliveryAddress,
        setDeliveryTime
      );
    }
  }, [sessionId, draftOrderId, isFromBurger]);

  const onSubmit = async () => {
    if (draftOrderId === null) {
      setError('ID заказа не может быть пустым');
      return;
    }
    await handleSubmitOrder(draftOrderId, deliveryAddress, deliveryTime, orderDetails, setOrderDetails, setError);
  };

  const onDeleteService = async (datacenterServiceId: string) => {
    if (draftOrderId === null) {
      setError('ID заказа не может быть пустым');
      return;
    }
    await handleDeleteService(draftOrderId, datacenterServiceId, setOrderDetails, setError);
  };

  const onQuantityChange = async (datacenterServiceId: string, newQuantity: number) => {
    if (draftOrderId === null) {
      setError('ID заказа не может быть пустым');
      return;
    }
    await handleQuantityChange(draftOrderId, datacenterServiceId, newQuantity, setError, setOrderDetails);
  };

  const handleDateChange = (date: Date | null) => {
    setDeliveryTime(date);
  };

  // Функция для переключения состояния раскрытия заказа
  const handleToggle = (orderId: string | number) => {
    setExpandedOrders(prevState => ({
      ...prevState,
      [orderId]: !prevState[orderId], // Переключение состояния для данного заказа
    }));
  };
  
  return (
    <div className="order-detail-container">
      <Navbar />
      <Breadcrumb 
        items={[
          { label: "Главная", path: "/" },
          { label: "Список товаров", path: "/datacenter-services" },
          { label: `Заказ #${draftOrderId}`, path: `/datacenter-orders/${draftOrderId}` }
        ]}
      />
      
{/* Order Details Section */}
{draftOrderId !== null && orderDetails && !loading && !error && !isFromBurger && (
  <div className="order-details-container">
    <h1 className="order-details-header">Детали заказа</h1>
    <div className="order-details-info">
      <p className="order-details-info-item">Статус: {orderDetails.status}</p>
      <p className="order-details-info-item">Дата создания: {formatTime(orderDetails.creation_date || null)}</p>
      {orderDetails.formation_date && (
        <p className="order-details-info-item">Дата формирования: {formatTime(orderDetails.formation_date)}</p>
      )}
      {orderDetails.completion_date && (
        <p className="order-details-info-item">Дата завершения: {formatTime(orderDetails.completion_date)}</p>
      )}
      <p className="order-details-info-item">Сумма: {orderDetails.total_price}</p>
      {orderDetails.delivery_address && (
        <p className="order-details-info-item">Адрес доставки: {orderDetails.delivery_address}</p>
      )}
      {orderDetails.delivery_time && (
        <p className="order-details-info-item">Время доставки: {formatTime(orderDetails.delivery_time)}</p>
      )}
    </div>
    
{/* Услуги */}
<h2 className="order-details-services-header">Услуги</h2>
{orderDetails.datacenters && orderDetails.datacenters.length > 0 ? (
  orderDetails.datacenters.map((service, index) => (
    <div key={index} className="service-item-row">
      {/* Картинка */}
      <div className="service-image-wrapper">
        <img
          className="service-item-image"
          src={service.service?.image_url || defaultImageUrl}
          alt={service.service?.name}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = defaultImageUrl;
          }}
        />
      </div>

      {/* Название услуги */}
      <p className="service-item-name">{service.service?.name}</p>

      {/* Количество */}
      <p className="service-item-quantity">Количество: {service.quantity}</p>

      {/* Поле ввода для изменения количества */}
      <div className="quantity-edit">
  <input
    className="quantity-input-field"
    type="number"
    value={quantity || ''}
    min="1"
    onChange={(e) => setQuantity(Number(e.target.value))}
    placeholder="Новое кол-во"
  />
  <button
    className="update-quantity-btn"
    onClick={() => onQuantityChange(service.service?.id?.toString() || '', quantity || 1)}
  >
    Обновить
  </button>
</div>

      {/* Кнопка удаления */}
      <button
        className="delete-service-btn"
        onClick={() => onDeleteService(service.service?.id?.toString() || '')}
      >
        Удалить
      </button>
    </div>
  ))
) : (
  <p>Нет доступных услуг для данного заказа.</p>
)}
    
    {/* Форма для редактирования */}
<h2 className="order-details-edit-header">Редактировать данные</h2>
<div className="order-details-edit-form">
  <div className="input-container">
    <label className="input-label">
      Адрес доставки:
      <input
        className="address-input-field"
        type="text"
        value={deliveryAddress}
        onChange={(e) => setDeliveryAddress(e.target.value)}
        placeholder="Введите адрес доставки"
      />
    </label>
  </div>

  <div className="input-container">
  <label className="input-label">
    Время доставки:
    <div className="datepicker-wrapper">
      <FaCalendarAlt
        className="datepicker-icon"
        onClick={() => document.getElementById('datepicker')?.click()}
      />
      <DatePicker
        id="datepicker"
        selected={deliveryTime}
        onChange={handleDateChange}
        showTimeSelect
        timeIntervals={15}
        dateFormat="Pp"
        placeholderText="Выберите время доставки"
        customInput={<div />}
      />
    </div>
  </label>
</div>

  <div className="selected-time-display">
    <strong>Выбранное время:</strong> {formatTime(deliveryTime)}
  </div>
</div>

    {/* Кнопка подтверждения */}
    <button className="confirm-order-btn" onClick={onSubmit}>Подтвердить заказ</button>
  </div>
)}

{/* Loading and Error Handling */}
{loading && <div className="loading-message">Загрузка...</div>}
{error && <div className="error-message">{error}</div>}

{/* Order List Section */}
<h3 className="order-list-header">Список заказов:</h3>
{orders.length > 0 ? (
  <table className="order-table">
    <thead>
      <tr>
        <th>№ Заказа</th>
        <th>Статус</th>
        <th>Дата создания</th>
        <th>Дата формирования</th>
        <th>Дата завершения</th>
        <th>Адрес доставки</th>
        <th>Время доставки</th>
        <th>Сумма</th>
        <th>Услуги</th>
      </tr>
    </thead>
    <tbody>
      {orders.map((order) => (
        <>
          {/* Строка с информацией о заказе */}
          <tr key={order.id}>
            <td onClick={() => {
              if (order.id !== undefined) {
                handleToggle(order.id);
              }
            }} className="order-table-cell clickable">
              Заказ #{order.id}
            </td>
            <td className="order-table-cell">{order.status}</td>
            <td className="order-table-cell">{formatTime(order.creation_date || null)}</td>
            <td className="order-table-cell">
              {order.formation_date ? formatTime(order.formation_date) : 'Не указана'}
            </td>
            <td className="order-table-cell">
              {order.completion_date ? formatTime(order.completion_date) : 'Не указана'}
            </td>
            <td className="order-table-cell">{order.delivery_address || 'Не указан'}</td>
            <td className="order-table-cell">
              {order.delivery_time ? formatTime(order.delivery_time) : 'Не указана'}
            </td>
            <td className="order-table-cell">
              {order.total_price !== undefined ? order.total_price : 'Не указана'}
            </td>
            <td className="order-table-cell">
              <button
                className="toggle-button"
                onClick={() => {
                  if (order.id !== undefined) {
                    handleToggle(order.id);
                  }
                }}
              >
                {order.id !== undefined && expandedOrders[order.id] ? 'Скрыть услуги' : 'Показать товары'}
              </button>
            </td>
          </tr>

         {/* Строки с услугами, которые показываются при клике */}
{order.id !== undefined && expandedOrders[order.id] && order.datacenters && order.datacenters.length > 0 && (
  order.datacenters.map((datacenter, index) => (
    <tr key={`service-${index}-${order.id}`} className="service-row">
      <td colSpan={9} className="service-row-cell">
        <div className="service-item">
          <p className="service-list-item-info">Услуга: {datacenter.service?.name || 'Не указано'}</p>
          
          <p className="service-list-item-info">Цена: {datacenter.service?.price || 'Не указана'}</p>
          <p className="service-list-item-info">Количество: {datacenter.quantity || 'Не указано'}</p>
          <div className="service-image-container">
            <img
              className="service-list-item-image"
              src={datacenter.service?.image_url || defaultImageUrl}
              alt={datacenter.service?.name || 'Услуга'}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = defaultImageUrl;
              }}
            />
          </div>
        </div>
      </td>
    </tr>
  ))
)}

{/* В случае, если у заказа нет услуг */}
{order.id !== undefined && expandedOrders[order.id] && order.datacenters?.length === 0 && (
  <tr key={`no-services-${order.id}`}>
    <td colSpan={9} className="service-row-cell">Нет услуг в заказе</td>
  </tr>
)}
        </>
      ))}
    </tbody>
  </table>
) : (
  <p>Заказы отсутствуют</p>
)}
    </div>
  );
};

export default OrderDetailDatacenter;